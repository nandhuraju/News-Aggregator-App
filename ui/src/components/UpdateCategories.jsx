import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateCategories = () => {
  const [categories, setCategories] = useState({
    business: false,
    entertainment: false,
    general: false,
    health: false,
    science: false,
    sports: false,
    technology: false,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setCategories((prevCategories) => ({
      ...prevCategories,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      const selectedCategories = Object.keys(categories).filter(
        (category) => categories[category]
      );

      const res = await axios.post(
        '/api/user/updateCategories',
        { categories: selectedCategories },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert('Categories updated successfully');
      } else {
        setError('Failed to update categories');
      }
    } catch (err) {
      setError(`Error updating categories: ${err.message}`);
    }
  };

  useEffect(() => {
    // Fetch user categories from server on mount
    const fetchUserCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          return;
        }

        const res = await axios.get('/api/user/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          const userCategories = res.data.categories.reduce(
            (acc, category) => ({ ...acc, [category]: true }),
            {}
          );
          setCategories((prevCategories) => ({
            ...prevCategories,
            ...userCategories,
          }));
        } else {
          setError('Failed to fetch categories');
        }
      } catch (err) {
        setError(`Error fetching categories: ${err.message}`);
      }
    };

    fetchUserCategories();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Update Categories</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(categories).map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={category}
              name={category}
              checked={categories[category]}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor={category} className="capitalize">{category}</label>
          </div>
        ))}
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Update Categories
        </button>
      </form>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default UpdateCategories;
