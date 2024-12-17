import { useQuery } from '@apollo/client'
import { USER } from '../queries'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Login from './Login'

const Menubar = () => {
  const res = useQuery(USER)
  const user = res.data?.user

  const getLoggedLinks = () => {
    if (!user) return null

    return (
      <>
        <Nav.Link as={Link} to='/add'>
          Add book
        </Nav.Link>
        <Nav.Link as={Link} to='/recommendations'>
          Recommendations
        </Nav.Link>
      </>
    )
  }

  return (
    <Navbar
      bg='dark-subtle'
      className='border border-top-0 rounded-bottom mb-3'
    >
      <Container>
        <Nav className='me-auto'>
          <Nav.Link as={Link} to='/'>
            Authors
          </Nav.Link>
          <Nav.Link as={Link} to='/books'>
            Books
          </Nav.Link>
          {getLoggedLinks()}
        </Nav>
        <Nav>
          <Login />
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Menubar
