

import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
    timeout: 3000,
    // position: 'center-top',
});

const axios = require('axios').default;

const per_page = 40;
let page = 1;
let newSearchQuery = null;

const divGallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const searchQuery = form.elements.searchQuery.value;
    
    if (newSearchQuery !== searchQuery) {
        resetPage();
    }
    newSearchQuery = searchQuery;
       
    getPhoto(searchQuery).then(response => {
        const totalPages = response.totalHits / per_page;
        // console.log(totalPages);
        // console.log(Math.ceil(totalPages));        

        if (totalPages < page) {
            Notify.failure('We`re sorry, but you`ve reached the end of search results.');
            return;
        }

        incrementPage(); 

        if (!response.hits.length) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }

        divGallery.innerHTML = createMarkup(response.hits);
    }).catch(error => {
        console.error(error.message);
    }); 


};

async function getPhoto(searchQuery) {
    const BASE_URL = 'https://pixabay.com/api';
    const KEY = 'key=33211320-dec57621770c8fad3b041e20d';
    const PARAM = '&image_type=photo&orientation=horizontal&safesearch=true'

    const response = await axios.get(`${BASE_URL}/?${KEY}&q=${searchQuery}${PARAM}&page=${page}&per_page=${per_page}`);
    return response.data;
};

function createMarkup(response) {
    return response.map(markupMaker).join('');

    function markupMaker({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
        return (
            `<div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                    <b>Likes ${likes}</b>
                    </p>
                    <p class="info-item">
                    <b>Views ${views}</b>
                    </p>
                    <p class="info-item">
                    <b>Comments ${comments}</b>
                    </p>
                    <p class="info-item">
                    <b>Downloads ${downloads}</b>
                    </p>
                </div>
            </div>`
        );
    };
};

function incrementPage() {
    return page += 1;
};

function resetPage() {
    return page = 1;
};