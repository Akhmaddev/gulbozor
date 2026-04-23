import React, { useState } from 'react';
import CategorySwiper from '../Components/CategorySwiper';
import Mahsulotlar from '../Components/Mahsulotlar';

// searchTerm-ni prop sifatida qabul qilamiz
const Home = ({ searchTerm }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    return (
        <div>
            <CategorySwiper 
                onSelectCategory={(id) => setSelectedCategoryId(id)} 
            />
            
            <Mahsulotlar 
                categoryId={selectedCategoryId} 
                searchTerm={searchTerm} 
            /> 
        </div>
    );
}

export default Home;