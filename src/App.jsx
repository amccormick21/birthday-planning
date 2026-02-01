import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Location from './pages/Location'
import Accommodation from './pages/Accommodation'
import Walks from './pages/Walks'
import './styles/App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<Location />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/walks" element={<Walks />} />
      </Routes>
    </div>
  )
}

export default App
