import React, { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Savat from './Pages/Savat';
import Yordamchi from './Pages/Yordamchi';

function App() {
  // 1. Qidiruv so'zini saqlash uchun state yaratamiz
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <div className='sayt'>
        {/* 2. Navbar-ga onSearch funksiyasini uzatamiz */}
        <Navbar onSearch={(val) => setSearchTerm(val)} />

        <Routes>
          {/* 3. Home sahifasiga qidiruv so'zini prop sifatida beramiz */}
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