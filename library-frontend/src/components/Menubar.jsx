import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Menubar = () => {
  return (
    <Navbar bg='secondary' className='border border-top-0 rounded-bottom mb-3'>
      <Container>
        <Nav className='me-auto'>
          <Nav.Link as={Link} to='/'>
            Authors
          </Nav.Link>
          <Nav.Link as={Link} to='/books'>
            Books
          </Nav.Link>
          <Nav.Link as={Link} to='/add'>
            Add book
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Menubar
