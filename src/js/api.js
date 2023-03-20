import axios from 'axios';
export const getData = async (searchSubmit, page, per_page) => {
  const API_KEY = '3946216-2b497e878c369ff4a3d42cd49';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchSubmit}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

  try {
    const response = await axios.get(URL);
    if (response.status === 404) {
      throw new Error('Error loading images from Pixabay', response.status);
    }
    return response.data;
  } catch (error) {
    console.error('Error loading images from Pixabay:', error);
  }
};
