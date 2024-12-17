import { useNotificationDispatch } from './contexts/NotificationContext'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from './queries'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import Menubar from './components/Menubar'
import Notification from './components/Notification'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'

const App = () => {
  const notificationDispatch = useNotificationDispatch()
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data.data.bookAdded
      const message = `New book has added: ${book.title} by ${book.author.name}`
      notificationDispatch({ message, type: 'info' })
      client.refetchQueries({
        include: [ALL_BOOKS, ALL_AUTHORS, ALL_GENRES],
      })
    },
  })

  return (
    <Router>
      <Container>
        <Menubar />
        <Notification />
        <Routes>
          <Route path='/' element={<Authors />}></Route>
          <Route path='/books' element={<Books />}></Route>
          <Route path='/add' element={<NewBook />}></Route>
          <Route path='/recommendations' element={<Recommendations />}></Route>
        </Routes>
      </Container>
    </Router>
  )
}

export default App
