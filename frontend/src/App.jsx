import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router'
import ChatWindow from './components/Chatwindow'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ChatWindow/>}/>
        <Route path='/chat' element={<ChatWindow/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
