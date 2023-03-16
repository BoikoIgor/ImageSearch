export const getData = (searchSubmit, page, per_page) => {
  const API_KEY = '3946216-2b497e878c369ff4a3d42cd49';

  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchSubmit}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

  return fetch(URL).then(response => {
    if (!response.ok) {
      throw new Error('Cant load images from Pixabay');
    }
    if (response.status === 404) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
