import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import HolidaysConsult from './components/HolidaysConsult';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/holidays' element={<HolidaysConsult></HolidaysConsult>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
