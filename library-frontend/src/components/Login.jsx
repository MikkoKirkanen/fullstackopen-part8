import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { LOGIN, USER } from '../queries'
import { useState } from 'react'
import {
  showError,
  useNotificationDispatch,
} from '../contexts/NotificationContext'
import {
  Button,
  Form,
  Modal,
  Nav,
  Navbar,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import { BoxArrowInRight, BoxArrowRight } from 'react-bootstrap-icons'

const Login = () => {
  const res = useQuery(USER)
  const [showLogin, setShowLogin] = useState(false)
  const emptyLogin = { username: '', password: '' }
  const [login, setLogin] = useState(emptyLogin)
  const notificationDispatch = useNotificationDispatch()
  const client = useApolloClient()

  const user = res?.data?.user

  const [userLogin, loginRes] = useMutation(LOGIN, {
    onCompleted: (res) => {
      localStorage.setItem('library-user-token', res.login.token)
      notificationDispatch({
        message: `Login successful`,
        type: 'success',
      })
      setLogin(emptyLogin)
      setShowLogin(false)
      client.refetchQueries({ include: [USER] })
    },
    onError: (e) => {
      notificationDispatch(showError(e.graphQLErrors))
    },
  })

  const handleHideLogin = () => setShowLogin(false)
  const handleShowLogin = () => setShowLogin(true)

  const handleLoginFormChange = (e) => {
    const target = e.target
    setLogin((state) => ({
      ...state,
      [target.name]: target.value,
    }))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    userLogin({ variables: login })
  }

  const handleLogout = () => {
    localStorage.clear()
    client.resetStore()
  }

  const loggedIn = () => {
    if (!user) return null

    return (
      <>
        <Navbar.Text className='text-success me-3'>
          Logged in: {user?.name}
        </Navbar.Text>
        <OverlayTrigger
          placement='left'
          overlay={<Tooltip id='logout-tooltip'>Logout</Tooltip>}
        >
          <Button
            id='logout'
            variant='danger'
            onClick={() => handleLogout()}
          >
            <BoxArrowRight />
          </Button>
        </OverlayTrigger>
      </>
    )
  }

  const loginForm = () => {
    if (user) return null

    return (
      <>
        <Navbar.Text className='text-danger me-3'>Not logged in</Navbar.Text>
        <OverlayTrigger
          placement='left'
          overlay={<Tooltip id='login-tooltip'>Login</Tooltip>}
        >
          <Button id='login' variant='success' onClick={handleShowLogin}>
            <BoxArrowInRight />
          </Button>
        </OverlayTrigger>

        <Modal show={showLogin} size='sm' onHide={handleHideLogin}>
          <Modal.Header closeButton>
            <Modal.Title as='h1'>Login</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleLogin}>
            <Modal.Body>
              <Form.Group className='mb-3' controlId='username'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  name='username'
                  placeholder='Enter username'
                  value={login.username}
                  onChange={handleLoginFormChange}
                />
                <div className='text-secondary'>username: aku</div>
              </Form.Group>
              <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  name='password'
                  placeholder='Enter password'
                  value={login.password}
                  onChange={handleLoginFormChange}
                />
                <div className='text-secondary'>password: password</div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className='justify-content-between'>
              <Button variant='secondary' onClick={handleHideLogin}>
                Close
              </Button>
              <Button variant='primary' onClick={handleLogin}>
                Login
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    )
  }

  return (
    <Nav>
      {loggedIn()}
      {loginForm()}
    </Nav>
  )
}

export default Login
