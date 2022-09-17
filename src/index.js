import './css/styles.css';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const messageShortInput = "Too many matches found. Please enter a more specific name.";
const messageWrangInput = "Oops, there is no country with that name";

let inputSearch = '';

const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

const { searchBox, countryList, countryInfo } = refs;

searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
    inputSearch = searchBox.value.toLowerCase().trim();
    console.log("input", inputSearch);
    fetchCountries(inputSearch);
}

function fetchCountries(name) {
    if (inputSearch !== ' ') {
        let promise = fetch(`https://restcountries.com/v3.1/name/${inputSearch}?fields=name,capital,population,flags,languages`).then(
            response => {
                if (!response.ok || response.status === 404) {
                    throw new Error(response.status);
                }
                return response.json();
            },);
        console.log("promise", promise);        
        promise.then((data) => {
            let lengthData = data.length;
            let lengthInputSearch = inputSearch.length;
            console.log("lengthInputSearch", lengthInputSearch);
            
            if (lengthInputSearch <= 1) {
                Notiflix.Notify.info(messageShortInput);
            }

            if (lengthData === 1) {
                renderCountryDescriprion(data);
            }

            if (lengthData > 1 && lengthData <= 10) {
                renderCountriesList(data);
            }            
        })
        .catch(error => {
            Notiflix.Notify.failure(messageWrangInput);
            clearCountryInfo();
            clearCountryList();
        });
    }    
}

function renderCountriesList(data) {
    clearCountryInfo();
    countryList.innerHTML = data.map(({ name, flags }) => 
        `
        <li class = "list-item">
            <img src = ${flags.svg} alt = ${name.official} width = 60 height = 40 class = "list-item-image">
            <p>${name.official}</p>
        </li>
        `
    ).join('');
}

function renderCountryDescriprion(data) {
    clearCountryList();
    countryInfo.innerHTML = data.map(({ name, flags, capital, population, languages }) =>
        `
        <div class = "name-flag-wrap">
            <img src = ${flags.svg} alt = ${name.official} width = 60 height = 40 class = "list-item-image image-title">
            <h1 class = "country-name">${name.official}</h1>
        </div>
        <div class = description-wrap>
            <p class = "description-text"><span class = "title-text">Capital:</span> ${capital}</p>
            <p class = "description-text"><span class = "title-text">Population:</span> ${population}</p>
            <p class = "description-text"><span class = "title-text">Languages:</span> ${Object.values(languages).join(', ')}</p>
        </div>
        `
    ).join('');
    
}

function clearCountryList() {
    countryList.innerHTML = '';
}

function clearCountryInfo() {
    countryInfo.innerHTML = '';
}