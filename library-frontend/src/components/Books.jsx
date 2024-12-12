import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { Table } from 'react-bootstrap'

const Books = () => {
  const res = useQuery(ALL_BOOKS)

  if (res.loading) {
    return <div>Loading...</div>
  }

  const books = res.data.allBooks || []

  return (
    <div>
      <h1>Books</h1>

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
              <td>{b.author}</td>
              <td className='text-end'>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Books
