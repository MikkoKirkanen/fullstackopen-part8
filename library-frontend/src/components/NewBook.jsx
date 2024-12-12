import { useState } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../queries'
import { useMutation } from '@apollo/client'
import {
  showError,
  useNotificationDispatch,
} from '../contexts/NotificationContext'

const NewBook = () => {
  const empty = { title: '', author: '', published: '', genres: [] }
  const [book, setBook] = useState(empty)
  const [genre, setGenre] = useState('')
  const notificationDispatch = useNotificationDispatch()

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onCompleted: (res) => {
      const book = res.addBook
      const title = book.title + (book.author ? ` by ${book.author}` : '')
      notificationDispatch({
        message: `New book added: ${title}`,
        type: 'success',
      })
      setBook(empty)
      setGenre('')
    },
    onError: (e) => {
      const message = 'Error creating book'
      const messages = e.graphQLErrors?.map((e) => e.message)
      notificationDispatch(showError({ message, messages }))
    },
  })

  const submit = async (e) => {
    e.preventDefault()
    createBook({ variables: book })
  }

  const handleBookChanges = ({ target }) => {
    const value =
      target.name === 'published' ? Number(target.value) : target.value
    setBook((state) => ({
      ...state,
      [target.name]: value,
    }))
  }

  const addGenre = () => {
    if (!genre) return null
    setBook((state) => ({
      ...state,
      genres: state.genres.concat(genre),
    }))
    setGenre('')
  }

  return (
    <div>
      <Form onSubmit={submit}>
        <Form.Group className='mb-3' controlId='title'>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type='text'
            name='title'
            value={book.title}
            onChange={handleBookChanges}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='author'>
          <Form.Label>Author</Form.Label>
          <Form.Control
            type='text'
            name='author'
            value={book.author}
            onChange={handleBookChanges}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='published'>
          <Form.Label>Published</Form.Label>
          <Form.Control
            type='number'
            name='published'
            value={book.published}
            onChange={handleBookChanges}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='genre'>
          <Form.Label>Genre</Form.Label>
          <InputGroup>
            <Form.Control
              type='text'
              name='genre'
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
            <Button variant='primary' onClick={addGenre} type='button'>
              Add genre
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className='mb-3' controlId='published'>
          <Form.Label>Genres: {book.genres.join(', ')}</Form.Label>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Create book
        </Button>
      </Form>
    </div>
  )
}

export default NewBook
