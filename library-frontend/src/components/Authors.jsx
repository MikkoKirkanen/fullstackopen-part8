import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, UPDATE_AUTHOR, USER } from '../queries'
import { Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import {
  showError,
  useNotificationDispatch,
} from '../contexts/NotificationContext'

const Authors = () => {
  const res = useQuery(ALL_AUTHORS)
  const [author, setAuthor] = useState(null)
  const notificationDispatch = useNotificationDispatch()
  const userRes = useQuery(USER)

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: ({ editAuthor }) => {
      const message = `Updated author: ${editAuthor.name}`
      notificationDispatch({ message, type: 'success' })
      setAuthor(null)
    },
    onError: (e) => {
      notificationDispatch(showError(e.graphQLErrors))
    },
  })

  useEffect(() => {
    if (!userRes.data?.user) {
      setAuthor(null)
    }
  }, [userRes?.data?.user])

  const user = userRes?.data?.user

  if (res.loading) {
    return <div>Loading...</div>
  }

  const editAuthor = (a) => {
    if (!user) return null
    setAuthor({
      ...a,
      born: a.born !== null ? a.born : '',
    })
  }

  const getEditInfo = () => {
    return user ? (
      <div className='text-info'>Click row to edit author's birthyear</div>
    ) : null
  }

  const handleBornChanges = ({ target }) => {
    setAuthor((a) => ({
      ...a,
      born: target.value,
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (author.born === '') {
      return notificationDispatch(
        showError([
          {
            message: 'Author validation failed',
            extensions: { error: { message: 'Born year is required' } },
          },
        ])
      )
    }

    const name = author.name
    const born = Number(author.born)
    updateAuthor({ variables: { name, born } })
  }

  const getAuthorEdit = () => {
    if (!author) return null

    return (
      <div className='edit-container'>
        <h2>Edit author's birthyear</h2>
        <Form onSubmit={submit}>
          <Form.Group controlId='title'>
            <Form.Label>Name: {author.name}</Form.Label>
          </Form.Group>
          <Form.Group className='mb-3' controlId='title'>
            <Form.Label>Born</Form.Label>
            <Form.Control
              type='number'
              className='born-input'
              name='born'
              value={author.born}
              onChange={handleBornChanges}
            />
          </Form.Group>
          <div className='d-flex justify-content-between'>
            <Button variant='secondary' onClick={() => setAuthor(null)}>
              Cancel
            </Button>
            <Button variant='primary' type='submit'>
              Update author
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  const authors = res?.data?.allAuthors || []

  return (
    <div>
      <h1>Authors</h1>
      {getEditInfo()}
      <Table className='w-auto' borderless hover={!!user}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {authors?.map((a) => (
            <tr
              key={a.name}
              className={user ? 'author-row' : ''}
              onClick={() => editAuthor(a)}
            >
              <td>{a.name}</td>
              <td className='text-end'>{a.born}</td>
              <td className='text-end'>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {getAuthorEdit()}
    </div>
  )
}

export default Authors
