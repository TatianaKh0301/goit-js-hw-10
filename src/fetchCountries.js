import Notiflix from 'notiflix';
import {
    renderCountryDescriprion,
    renderCountriesList,
    clearCountryList,
    clearCountryInfo
} from "./index";

const messageShortInput = "Too many matches found. Please enter a more specific name.";
const messageWrangInput = "Oops, there is no country with that name";

export function fetchCountries(inputSearch) {
    if (inputSearch === '') {
        return;
    }
    if (inputSearch !== ' ') {
        let promise = fetch(`https://restcountries.com/v3.1/name/${inputSearch}?fields=name,capital,population,flags,languages`).then(
            response => {
                if (!response.ok || response.status === 404) {
                    throw new Error(response.status);
                }
                return response.json();
            },);      
        promise.then((data) => {
            let lengthData = data.length;
            let lengthInputSearch = inputSearch.length;
            
            if (lengthInputSearch <= 1) {
                clearCountryInfo();
                clearCountryList();
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

