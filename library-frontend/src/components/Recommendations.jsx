import { useQuery } from '@apollo/client'
import { ALL_BOOKS, USER } from '../queries'
import { Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'

const Recommendations = () => {
  const userRes = useQuery(USER)
  const [genre, setGenre] = useState('')
  const bookRes = useQuery(ALL_BOOKS, {
    variables: { genre },
  })
  const books = bookRes?.data?.allBooks || []

  useEffect(() => {
    const favoriteGenre = userRes?.data?.user?.favoriteGenre
    if (favoriteGenre) {
      setGenre(favoriteGenre)
    }
  }, [userRes?.data])

  const getFavoriteGenre = () => {
    if (!genre) {
      return <p>You don't have a favorite genre set</p>
    }
    return (
      <p>
        <span>Books in your favorite genre: </span>
        <span className='fw-bold text-capitalize'>{genre}</span>
      </p>
    )
  }

  const getBooks = () => {
    if (!genre) return null
    if (!books?.length) {
      return <p>No books found in your favorite genre</p>
    }
    return (
      <Table striped borderless>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((b, i) => (
            <tr key={i}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td className='text-end'>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  return (
    <div>
      <h1>Recommendations</h1>
      {getFavoriteGenre()}
      {getBooks()}
    </div>
  )
}

export default Recommendations
