import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = ({ categories }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news', {
          params: { categories: categories.join(',') }
        });
        setNews(response.data.articles);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [categories]);

  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded mt-4">
        <h2 className="text-2xl font-bold mb-4">News</h2>
        {news.length > 0 ? (
          <ul>
            {news.map((article, index) => (
              <li key={index} className="mb-4">
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} className="w-full h-auto mb-2 rounded-md" />
                )}
                <h3 className="text-xl font-bold">{article.title}</h3>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Read more
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No news available for the selected categories.</p>
        )}
      </div>
    </div>
  );
};

export default News;
