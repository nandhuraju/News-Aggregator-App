import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Homepage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const res = await axios.get('/api/user/news', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        setArticles(res.data.articles);
      } else {
        setError('Error fetching news');
      }
    } catch (err) {
      setError(`Error fetching news: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const addToBookmark = async (article) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        return;
      }

      await axios.post('/api/user/bookmark', { article }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Article bookmarked successfully');
    } catch (err) {
      setError(`Error bookmarking article: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Top News</h1>
      {articles.length === 0 ? (
        <p className="text-center">No news articles available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-700 mb-4">{article.description}</p>
                <div className="flex justify-between items-center">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Read more
                  </a>
                  <button
                    onClick={() => addToBookmark(article)}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    Add to Bookmark
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Homepage;
