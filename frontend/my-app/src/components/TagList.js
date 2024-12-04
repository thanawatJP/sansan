import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryThreadApi } from '../store/thread';

function CategoryList() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryThreadApi();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }
    , []);

    const handleCategoryClick = async (category_id) => {
        try {
          navigate(`/search-results/categories/${category_id}/`);
        } catch (error) {
          console.error('Error fetching threads by category:', error);
        }
      };

    return (
        <div className="flex flex-col items-center bg-orange-50 p-4 w-full">
            <div className="flex gap-2 mt-2 overflow-x-auto w-2/3 flex-nowrap">
                {categories.map((category, index) => (
                <button
                    key={index}
                    onClick={() => handleCategoryClick(category.id)}
                    className="bg-orange-200 hover:bg-orange-300 rounded-md px-5 py-2 text-xl whitespace-nowrap"
                >
                    {category.name}
                </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryList;
