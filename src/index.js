// Імпортуємо стилі та бібліотеки
import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import axios from 'axios';
import { getData } from './js/api';
let items = [];
let page = 1;
let totalHits = 0;
let per_page = 40;
let searchSubmit = '';
let isLoading = false;

const searchForm = document.querySelector('#search-form');
const imagesList = document.querySelector('.gallery');

const handleSubmit = e => {
  e.preventDefault();
  const { value } = e.target.elements.searchQuery;
  if (searchSubmit === value || !value.trim()) {
    return;
  }
  searchSubmit = value.trim();
  page = 1;
  imagesList.innerHTML = '';
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
            <a href="${largeImageURL}" class="link overlay"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
            <div class="info">
              <p class="info-item">           
                <b>likes </b>${likes}
              </p>
              <p class="info-item">
                <b>views </b>${views}
              </p>
              <p class="info-item">
                <b>comments </b>${comments}
              </p>
              <p class="info-item">
                <b>downloads </b>${downloads}
              </p>
            </div>
          </div>`
    )
    .join('');
  if (!page) {
    imagesList.innerHTML = '';
  }
  imagesList.insertAdjacentHTML('beforeend', newImagesList);

  new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });

  // const { height: cardHeight } =
  //   imagesList.firstElementChild.getBoundingClientRect();
  // window.scrollBy({
  //   top: cardHeight * 2,
  //   behavior: 'smooth',
  // });

  isLoading = false;
};

function getImages() {
  if (isLoading) return;
  isLoading = true;
  getData(searchSubmit, page, per_page)
    .then(data => {
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      console.log(data);
      totalHits = data.totalHits;
      items = data.hits;
      webformatURL = data.hits.webformatURL;
      largeImageURL = data.hits.largeImageURL;
      tags = data.hits.tags;
      likes = data.hits.likes;
      views = data.hits.views;
      comments = data.hits.comments;
      downloads = data.hits.downloads;

      renderImages();

      if (imagesList.children.length >= data.totalHits) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => {
      console.error('you get this error:', error);
    });
}

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    if (isLoading) return;
    page += 1;
    getImages();
  }
});
