import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '42317927-6bc77f5b742ed8b3300db4489';
const BASE_URL = 'https://pixabay.com/api/';
const perPage = 40;

let currentPage = 1;
const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);

async function handleFormSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  const searchQuery = form.searchQuery.value.trim();

  if (searchQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  try {
    const response = await fetchImages(searchQuery);
    handleResponse(response.data.hits);
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Failed to fetch images. Please try again later.');
  }
}

async function loadMoreImages() {
  currentPage++;
  const searchQuery = form.searchQuery.value.trim();

  try {
    const response = await fetchImages(searchQuery);
    handleResponse(response.data.hits);
  } catch (error) {
    console.error('Error fetching more images:', error);
    Notiflix.Notify.failure('Failed to fetch more images. Please try again later.');
  }
}

async function fetchImages(searchQuery) {
  return axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: perPage,
    },
  });
}

function handleResponse(images) {
  if (images.length === 0) {
    Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  if (currentPage === 1) {
    gallery.innerHTML = '';
  }

  images.forEach(image => {
    const card = createPhotoCard(image);
    gallery.appendChild(card);
  });

  if (images.length < perPage) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
  } else {
    loadMoreBtn.style.display = 'block';
  }
}

function createPhotoCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;

  const info = document.createElement('div');
  info.classList.add('info');

  const infoItems = ['likes', 'views', 'comments', 'downloads'];
  infoItems.forEach(item => {
    const p = document.createElement('p');
    p.classList.add('info-item');
    p.innerHTML = `<b>${item.charAt(0).toUpperCase() + item.slice(1)}:</b> ${image[item]}`;
    info.appendChild(p);
  });

  card.appendChild(img);
  card.appendChild(info);
  return card;
}