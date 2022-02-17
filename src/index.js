import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'

const inputForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
let { searchQuery } = inputForm.elements;
const clear = elems => [...elems.children].forEach(div => div.remove());
const lightbox = () => new SimpleLightbox('.gallery a', {});
let searchQueryText = '';
let perPage = 40;
let page = 0;

loadBtn.style.display = 'none';

inputForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();
    if (searchQuery.value.length <= 0) { return };
    clear(gallery);
    searchQueryText = searchQuery.value;
    
    axiosPicture(searchQueryText).then((name => {
        if (name.hits.length > 0) {
            Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
            let totalPages = Math.ceil(name.totalHits / perPage);
            renderGallery(name);
            lightbox();
            if (page < totalPages) {
                loadBtn.style.display = 'block';
                page += 1;
            } else {
                loadBtn.style.display = 'none';
                console.log('There are no more images');
                Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            }
        } else {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.',
            );
            clear(gallery);
        }
    }))
        .catch(error => console.log(error));
}
    
async function axiosPicture(text, page) {
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=25722602-ef4054fc4542d7cb871df6c01&q=${text}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
        // console.log(response);
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

loadBtn.addEventListener(
  'click',
  () => {
    page += 1;
    axiosPicture(searchQueryText, page).then(name => {
      let totalPages = Math.ceil(name.totalHits / perPage);
      renderGallery(name);
      lightbox();

      if (page >= totalPages) {
        loadBtn.style.display = 'none';
        console.log('There are no more images');
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    });
  },
  true,
);
