import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditApiNews = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    urlToImage: "",
    category: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/news/${id}`);
        setArticle(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          url: response.data.url,
          urlToImage: response.data.urlToImage,
          category: response.data.category,
        });
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };
    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Since you cannot update the news from the API, you can just simulate this step
      navigate("/home");
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  if (!article) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit API News</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled
        />
        <input
          name="url"
          value={formData.url}
          onChange={handleChange}
          disabled
        />
        <input
          name="urlToImage"
          value={formData.urlToImage}
          onChange={handleChange}
          disabled
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled
        />
        <button type="submit" disabled>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditApiNews;
