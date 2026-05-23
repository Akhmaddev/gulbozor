import React, { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Savat from './Pages/Savat';
import Yordamchi from './Pages/YordamchiAi';


function App() {
  
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <div className='sayt'>
        
        <Navbar onSearch={(val) => setSearchTerm(val)} />

        <Routes>
          
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          
          <Route path="/savat" element={<Savat />} />
          <Route path="/yordamchi" element={<Yordamchi />} />
        </Routes>
            
        <Footer />
      </div>
    </Router>
  );
}

export default App;