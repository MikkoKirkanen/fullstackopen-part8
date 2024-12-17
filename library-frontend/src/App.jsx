import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import Menubar from './components/Menubar'
import Notification from './components/Notification'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'

const App = () => {
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
