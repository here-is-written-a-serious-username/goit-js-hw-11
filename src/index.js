

import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Notify.init({
//     timeout: 3000,
//     position: 'center-top',
// });

const axios = require('axios').default;

const divGallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const searchQuery = form.elements.searchQuery.value;
    getPhoto(searchQuery);
};

async function getPhoto(searchQuery) {
    const BASE_URL = 'https://pixabay.com/api';
    const KEY = 'key=33211320-dec57621770c8fad3b041e20d';
    const PARAM = '&image_type=photo&orientation=horizontal&safesearch=true'

    const response = await axios.get(`${BASE_URL}/?${KEY}&q=${searchQuery}${PARAM}`);
    return response.data.hits;

    // console.log(response.data.hits);
    // divGallery.innerHTML = createMarkup(response.data.hits);
};
getPhoto().then( response => {
    // console.log(response);
    divGallery.innerHTML = createMarkup(response);
}).catch(error => {
    console.error(error);
});

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