import axios from "axios";
import Notiflix from "notiflix";
import Simplelightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
const apiKey = '42317927-6bc77f5b742ed8b3300db4489';

const searchQuery = document.querySelector("[name='searchQuery']");
const searchButton = document.querySelector(".searchButton");
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector(".load-more");

let page = 1;
let replaceUserInput;

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
                <a href="${hit.largeImageURL}"><img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" /></a>
                <div class="info">
                    <p class="info-item"><b>Likes</b> ${hit.likes}</p>
                    <p class="info-item"><b>Views</b> ${hit.views}</p>
                    <p class="info-item"><b>Comments</b> ${hit.comments}</p>
                    <p class="info-item"><b>Downloads</b> ${hit.downloads}</p>
                </div>
            `;
            gallery.appendChild(newElement);
        }

        if (response.data.totalHits <= page * 40) {
            loadMoreButton.style.visibility = "hidden";
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        } else {
            loadMoreButton.style.visibility = "visible";
        }

        lightbox.refresh();

        lightbox.on('shown.simplelightbox', () => {
        document.body.style.overflow = 'hidden';
        })
        lightbox.on('closed.simplelightbox', () => {
        document.body.style.overflow = '';
    })

        
    } catch (error) {
        console.error("Error fetching data:", error);
        Notiflix.Notify.failure("Something went wrong, please try again.");
    }

};


const searchFunction = () => {
    gallery.innerHTML = "";
        page = 1;
    const userInput = searchQuery.value;
    replaceUserInput = encodeURIComponent(userInput).replaceAll("%20", "+");

    fetchImages(replaceUserInput, page);

    loadMoreButton.style.visibility = "hidden";
}

searchQuery.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        searchFunction();
    }
});

searchButton.addEventListener('click', () => {
    searchFunction();
})


loadMoreButton.addEventListener('click', () => {
    page++;
    fetchImages(replaceUserInput, page);
    loadMoreButton.style.visibility = "hidden";
});

const lightbox = new Simplelightbox('.photo-card a', {
    scrollZoom: false,
    disableScroll: true,
});