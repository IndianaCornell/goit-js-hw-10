import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

import './style.css';
import { fetchBreeds, fetchCatByBreed } from './js/cat-api';
import { Report } from 'notiflix/build/notiflix-report-aio';

const refs = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  catInfo: document.querySelector('.cat-info'),
};

const { select, loader, error, catInfo } = refs;

loader.classList.add('is-hidden');
error.classList.add('is-hidden');
catInfo.classList.add('is-hidden');

// let's fill out the cat list

let arrBreedsId = [];

fetchBreeds()
  .then(data => {
    data.forEach(breed =>
      arrBreedsId.push({ text: breed.name, value: breed.id })
    );
    new SlimSelect({
      select: select,
      data: arrBreedsId,
    });
  })
  .catch(err => {
    select.classList.add('is-hidden');
    loader.classList.add('is-hidden');
    Report.failure(
      'Oops! Something went wrong!',
      'Page will automatically refresh in 3... 2... 1...',
      pageReload()
    );
  });

//   let's look for information about the cat

const onSelectBreed = function (event) {
  loader.classList.remove('is-hidden');
  catInfo.classList.add('is-hidden');

  const selectedBreed = event.currentTarget.value;

  fetchCatByBreed(selectedBreed)
    .then(data => {
      const { url, breeds } = data[0];
      catInfo.innerHTML = `<div><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="desc"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`;
      catInfo.classList.remove('is-hidden');
    })
    .then(() => {
      loader.classList.add('is-hidden');
      select.classList.remove('is-hidden');
    })
    .catch(err => {
      select.classList.add('is-hidden');
      loader.classList.add('is-hidden');
      Report.failure(
        'Oops! Something went wrong!',
        'Page will automatically refresh in 3... 2... 1...',
        pageReload()
      );
    });
};

select.addEventListener('change', onSelectBreed);

// page reload function

const pageReload = function () {
  setTimeout(() => {
    location.reload();
  }, 3000);
};
