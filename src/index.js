// Імпортуємо стилі
import './css/styles.css';
// Імпортуємо бібліотеки
import Notiflix from 'notiflix';
import axios from 'axios';
import OnlyScroll from 'only-scrollbar';
import { getData } from './js/api';
let page = 1;
let per_page = 20;
let searchSubmit = '';

// const axios = require('axios/dist/browser/axios.cjs'); // browser
// const axios = require('axios/dist/node/axios.cjs'); // node
// const scroll = new OnlyScroll('.scroll-container', {
//   damping: 0.8,
//   eventContainer: window,
// });
const scroll = new OnlyScroll(document.querySelector('.scroll-container'), {
  damping: 0.8,
  eventContainer: window,
});
const searchForm = document.querySelector('#search-form');
const imagesList = document.querySelector('.grid');

const handleSubmit = e => {
  e.preventDefault();
  const { value } = e.target.elements.searchQuery;
  searchSubmit = value;
  getImages();
};
searchForm.addEventListener('submit', handleSubmit);

const renderImages = () => {
  const imagesList = items.map(`<div class="photo-card">
            <img src="./images/logo.png" alt="" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
              </p>
              <p class="info-item">
                <b>Views</b>
              </p>
              <p class="info-item">
                <b>Comments</b>
              </p>
              <p class="info-item">
                <b>Downloads</b>
              </p>
            </div>
          </div>`);
  imagesList.innerHTML = '';
};

function getImages() {
  getData(searchSubmit, page, per_page)
    .then(data => {
      if (data.hits.length === 0) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      console.log(data);
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
// console.log('Hi fuck');
