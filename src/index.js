import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '42317927-6bc77f5b742ed8b3300db4489';
const BASE_URL = 'https://pixabay.com/api/';
let currentPage = 1;

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  currentPage = 1;
  const searchQuery = form.searchQuery.value.trim();

  if (searchQuery === '') {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });

    handleResponse(response.data.hits);
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Failed to fetch images. Please try again later.');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;

  const searchQuery = form.searchQuery.value.trim();

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });

    handleResponse(response.data.hits);
  } catch (error) {
    console.error('Error fetching more images:', error);
    Notiflix.Notify.failure('Failed to fetch more images. Please try again later.');
  }
});

function handleResponse(images) {
  if (images.length === 0) {
    Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  if (currentPage === 1) {
    gallery.innerHTML = '';
  }

  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    gallery.appendChild(card);
  });

  if (images.length < 40) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
  } else {
    loadMoreBtn.style.display = 'block';
  }
}