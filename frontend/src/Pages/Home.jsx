import React, { useState } from 'react';
import CategorySwiper from '../Components/CategorySwiper';
import Mahsulotlar from '../Components/Mahsulotlar';
import Carusel from '../Components/Carusel';
import Afzalliklar from '../Components/Afzalliklar';

const Home = ({ searchTerm }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // Foydalanuvchi qidiryaptimi? (faqat bo'sh joy yozilsa qidiruv hisoblanmaydi)
    const isSearching = (searchTerm || '').trim() !== '';

    return (
        <div>
            {/* Qidiruv paytida karusel va afzalliklar yashiriladi */}
            {!isSearching && <Carusel />}
            {!isSearching && <Afzalliklar />}

            {/* Kategoriya doim ko'rinib turadi */}
            <CategorySwiper
                onSelectCategory={(id) => setSelectedCategoryId(id)}
            />

            {/* Mahsulotlar kategoriya tagida chiqadi */}
            <Mahsulotlar
                categoryId={selectedCategoryId}
                searchTerm={(searchTerm || '').trim()}
            />
        </div>
    );
};

export default Home;