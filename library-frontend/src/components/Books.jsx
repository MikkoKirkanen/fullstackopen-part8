import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'
import { Form, Table } from 'react-bootstrap'
import { useState } from 'react'

const Books = () => {
  const [genre, setGenre] = useState('')
  const bookRes = useQuery(ALL_BOOKS, {
    variables: { genre },
  })
  const genreRes = useQuery(ALL_GENRES)

  const handleGenreSelect = (e) => {
    setGenre(e.target.value)
  }

  const books = bookRes?.data?.allBooks || []
  const genres = genreRes?.data?.allGenres || []

  return (
    <div>
      <h1>Books</h1>
      <Form.Group className='mb-3' controlId='genres'>
        <Form.Label>Selected genre</Form.Label>
        <Form.Select className='text-capitalize' value={genre} onChange={handleGenreSelect}>
          <option value=''>all</option>
          {genres?.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
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
    </div>
  )
}

export default Books
