// Імпортуємо стилі
import './css/styles.css';
// Імпортуємо бібліотеки
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { getData } from './js/api';
let items = [];
let page = 1;
let per_page = 40;
let searchSubmit = '';

const searchForm = document.querySelector('#search-form');
const imagesList = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
loadMore.style.display = 'none';

const handleSubmit = e => {
  e.preventDefault();
  const { value } = e.target.elements.searchQuery;
  if (searchSubmit === value || !value) {
    return;
  }
  searchSubmit = value;
  page = 1;
  imagesList.innerHTML = '';
  getImages();
};
const handleLoadMore = e => {
  page++;
  getImages();
};
searchForm.addEventListener('submit', handleSubmit);
loadMore.addEventListener('click', handleLoadMore);

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
            <a href="${largeImageURL}" class="link overlay"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
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
  if (!page) {
    imagesList.innerHTML = '';
  }
  imagesList.insertAdjacentHTML('beforeend', newImagesList);

  // if (imagesList.children.length >= totalHits) {
  //   loadMore.style.display = 'none';
  //   Notiflix.Notify.failure(
  //     "We're sorry, but you've reached the end of search results."
  //   );
  // } else {
  //   // Інакше показуємо кнопку «Завантажити ще»
  //   // loadMore.style.display = 'block';
  // }

  new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  // плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень
  // const { height: cardHeight } =
  //   imagesList.firstElementChild.getBoundingClientRect();
  // window.scrollBy({
  //   top: cardHeight * 2,
  //   behavior: 'smooth',
  // });
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
      totalHits = data.totalHits;
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
      loadMore.style.display = 'none';
      renderImages();
      if (imagesList.children.length >= totalHits) {
        loadMore.style.display = 'none';
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        // Інакше показуємо кнопку «Завантажити ще»
        loadMore.style.display = 'block';
      }
    })
    .catch(error => {
      console.error('your error:', error);
    });
}
