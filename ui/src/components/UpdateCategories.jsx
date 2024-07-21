import React, { useState, useEffect } from 'react';
import axios from 'axios';

const categoriesList = [
  'business', 'entertainment', 'general', 'health',
  'science', 'sports', 'technology'
];

const UpdateCategories = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the current user categories
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/user/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 200) {
          setSelectedCategories(res.data.categories);
        } else {
          setMessage('Failed to fetch user categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setMessage('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const category = e.target.name;
    setSelectedCategories(prevSelected =>
      prevSelected.includes(category)
        ? prevSelected.filter(c => c !== category)
        : [...prevSelected, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/user/updateCategories', { categories: selectedCategories }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (res.status === 200) {
        setMessage('Categories updated successfully');
      } else {
        setMessage('Failed to update categories');
      }
    } catch (error) {
      console.error('Error updating categories:', error);
      setMessage('Failed to update categories');
    }
  };
  
  

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Categories</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {categoriesList.map(category => (
            <div key={category} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="ml-2">{category}</span>
              </label>
            </div>
          ))}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Categories
        </button>
      </form>
    </div>
  );
};

export default UpdateCategories;
