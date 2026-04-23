import React from 'react'
import CategorySwiper from '../Components/CategorySwiper';
import Mahsulotlar from '../Components/Mahsulotlar';

const Home = () => {
  return (
    <div>
       <CategorySwiper />
     
     {/* 2. Mahsulotlar komponentini shu yerga joylashtiring */}
     <Mahsulotlar />
    </div>
  )
}

export default Home