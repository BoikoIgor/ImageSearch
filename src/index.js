// Імпортуємо стилі
import './css/styles.css';
// Імпортуємо бібліотеки
import Notiflix from 'notiflix';
import axios from 'axios';
import { getData } from './js/api';
let page = 1;
let per_page = 40;
let searchSubmit = '';

const searchForm = document.querySelector('#search-form');
const imagesList = document.querySelector('.gallery');

const handleSubmit = e => {
  e.preventDefault();
  const { value } = e.target.elements.searchQuery;
  searchSubmit = value;
  getImages();
};
searchForm.addEventListener('submit', handleSubmit);

const renderImages = () => {
  const newImagesList = items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes: ${likes}</b>
              </p>
              <p class="info-item">
                <b>Views: ${views}</b>
              </p>
              <p class="info-item">
                <b>Comments: ${comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads: ${downloads}</b>
              </p>
            </div>
          </div>`
    )
    .join('');
  imagesList.innerHTML = '';
  imagesList.insertAdjacentHTML('beforeend', newImagesList);
  // плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень
  const { height: cardHeight } =
    imagesList.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

function getImages() {
  getData(searchSubmit, page, per_page)
    .then(data => {
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      // загальна кількість зображень
      totalImages = data.totalHits;
      items = data.hits;
      // посилання на маленьке зображення для списку карток.
      webformatURL = data.hits.webformatURL;
      // посилання на велике зображення.
      largeImageURL = data.hits.largeImageURL;
      // рядок з описом зображення. Підійде для атрибуту alt
      tags = data.hits.tags;
      // кількість лайків.
      likes = data.hits.likes;
      // кількість переглядів.
      views = data.hits.views;
      // кількість коментарів.
      comments = data.hits.comments;
      // кількість завантажень.
      downloads = data.hits.downloads;
      renderImages();
    })
    .catch(error => {
      console.error('your error:', error);
    });
}
