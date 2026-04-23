import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Savat from './Pages/Savat';
import Yordamchi from './Pages/Yordamchi';


function App() {
  return (
    
    <Router>
      <div className='sayt'>
        <Navbar />
        
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/savat" element={<Savat />} />
            <Route path="/yordamchi" element={<Yordamchi />} />
          </Routes>
       

        <Footer />
      </div>
    </Router>
  );
}

export default App;