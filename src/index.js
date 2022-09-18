import './css/styles.css';
// import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');
import { fetchCountries } from "./fetchCountries";

const DEBOUNCE_DELAY = 300;

let inputSearch = '';
let data = {};

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

export function renderCountriesList(data) {
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

export function renderCountryDescriprion(data) {
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

export function clearCountryList() {
    countryList.innerHTML = '';
}

export function clearCountryInfo() {
    countryInfo.innerHTML = '';
}