import axios from "axios";
import InfiniteScroll from "infinite-scroll";
import Notiflix from "notiflix";

const apiKey = process.env.VITE_API_KEY;

const searchQuery = document.querySelector("[name='searchQuery']");
const searchButton = document.querySelector(".searchButton");
const gallery = document.querySelector('.gallery');

let page = 1;
let replaceUserInput; 

// Function to fetch and display images
const fetchImages = async (query, page) => {
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
        
        if (response.data.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }

        const hits = response.data.hits;
        for (let i = 0; i < hits.length; i++) {
            const hit = hits[i];
            const newElement = document.createElement('div');
            newElement.classList.add("photo-card");
            newElement.innerHTML = `
        <img
          src="${hit.webformatURL}"
          alt=""
          loading="lazy"
        />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${hit.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${hit.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${hit.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${hits[i].downloads}
          </p>
        </div>`;
            gallery.appendChild(newElement);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        Notiflix.Notify.failure("Something went wrong, please try again.");
    }
};

searchButton.addEventListener('click', () => {
    gallery.innerHTML = ""; 
    page = 1;
    const userInput = searchQuery.value;
    replaceUserInput = encodeURIComponent(userInput).replaceAll("%20", "+"); 
    fetchImages(replaceUserInput, page);
});
