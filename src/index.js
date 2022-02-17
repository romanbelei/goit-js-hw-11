import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'
// import debounce from 'lodash.debounce';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
let { searchQuery } = inputForm.elements;
const clear = elems => [...elems.children].forEach(div => div.remove());
const lightbox = () => new SimpleLightbox('.gallery a', {});
let perPage = 40;
let page = 0;

loadBtn.style.display = 'none';

inputForm.addEventListener('submit', onSubmit);

// refs.inputCantry.addEventListener('input', debounce(onInputFind, DEBOUNCE_DELAY));

function onSubmit(e) {
    e.preventDefault();
    clear(gallery);
    const searchQueryText = searchQuery.value;
    
    axiosPicture(searchQueryText).then((name => {
        if (name.hits.length > 0) {
            Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
            let totalPages = Math.ceil(name.totalHits / perPage);
            renderGallery(name);
            lightbox();
            if (page < totalPages) {
                loadBtn.style.display = 'block';
            } else {
                loadBtn.style.display = 'none';
                console.log('There are no more images');
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            }
        } else {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.',
            );
            clear(gallery); //reset view in case of failure
        }
    }))
        .catch(error => console.log(error));
}
    
async function axiosPicture(text, page) {
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=25722602-ef4054fc4542d7cb871df6c01&q=${text}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
        console.log(response);
        return response.data;
    }
     catch (error) {
    console.log(error);
  }
}


function renderGallery(name) {
  const markup = name.hits
    .map(hit => {
      return `<div class="photo-card">
      <a class="gallery__item" href="${hit.largeImageURL}"> <img class="gallery__image" src="${hit.webformatURL}" 
      alt="${hit.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <p><b>Likes</b> <br>${hit.likes}</br></p>
        </p>
        <p class="info-item">
          <p><b>Views</b> <br>${hit.views}</br></p>
        </p>
        <p class="info-item">
          <p><b>Comments</b> <br>${hit.comments}</br></p>
        </p>
        <p class="info-item">
          <p><b>Downloads</b> <br>${hit.downloads}</br></p>
        </p>
      </div>
    </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}
// function fetchCountries(text) {
//     return fetch(`https://pixabay.com/api/?key=25722602-ef4054fc4542d7cb871df6c01&q=${text}&image_type=photo&orientation=orientation&safesearch=true`)
//            .then((response) => {
//             if (!response.ok) {
//             throw new Error(response.status);
//     }
//             return response.json();
//         })
// }

// function renderCantryList(cantry) {
//     if (cantry.length > 10) {
//         Notify.info(`Too many matches found. Please enter a more specific name.`);
//         return
//     }
//     const markupCantryList = cantry.map((item) => {
//         return `<li style=" display: flex"; margin-down: 5px>
//         <img  width="30" height="30" style="margin-right: 10px" src="${item.flags.svg}" />
//         <p style="font-size: 24px">${item.name.official}</p>
//         </li>`}).join("");
//         CountryList(markupCantryList);
    
//     if (cantry.length === 1) {
//          const markupCantryInfo = cantry.map((item) => {
//         return `
//         <p style="font-size: 24px"><b>Capital:  </b>${item.capital}</p>
//         <p style="font-size: 24px"><b>Population:  </b>${item.population}</p>
//         <p style="font-size: 24px"><b>Languages:  </b>${Object.values(item.languages)}</p>
//         `}).join("");
//         CountryInfo(markupCantryInfo); 
//     }
// }
// function template(text) { }


// function CountryList(list) {refs.cantryList.innerHTML = list;}
// function CountryInfo(info) {refs.cantryInfo.innerHTML = info;}