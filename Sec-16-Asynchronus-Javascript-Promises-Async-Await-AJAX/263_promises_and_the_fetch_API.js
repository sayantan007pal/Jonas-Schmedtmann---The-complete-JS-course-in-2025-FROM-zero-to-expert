/**
 * Renders a country card into the DOM
 * 
 * @param {Object} data - Country object from the REST Countries API
 * @param {string} className - Optional CSS class ('neighbour' for border countries)
 * 
 * In the Fetch API / Promises lesson, the rendering logic is extracted into
 * its own function (renderCountry) to keep getCountryData focused only on
 * the network request — separation of concerns.
 */
const renderCountry = function(data, className = '') {
    const html = `
        <article class="country ${className}">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(1)}M people</p>
                <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
                <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
        </article>
    `
    // Insert the HTML card at the end of the body
    document.body.insertAdjacentHTML('beforeend', html)
}

/**
 * Fetches country data from the REST Countries API using the Fetch API
 * 
 * Key Concepts:
 * 1. fetch() - Modern way to make HTTP requests, returns a Promise
 * 2. Promise - An object representing the eventual completion/failure of an async operation
 * 3. .then() - Method to handle the resolved value of a Promise
 */
const getCountryData = function(country){
    // fetch() returns a Promise that resolves to a Response object
    // The Promise is fulfilled as soon as the server responds with headers
    // (even before the body is fully downloaded)
    fetch(`https://restcountries.com/v2/name/${country}`)
        .then(function(response){
            // 'response' is a Response object containing:
            // - status: HTTP status code (200, 404, etc.)
            // - ok: boolean (true if status is 200-299)
            // - headers: response headers
            // - body: the actual data (as a ReadableStream)
            console.log(response)
            
            // response.json() reads the body and parses it as JSON
            // It also returns a Promise (because reading the body is async)
            // We return this Promise to chain it with the outer .then()
            return response.json().then(function(data){
                // 'data' is the parsed JSON - an array of country objects
                // Each object contains: name, capital, population, flags, etc.
                console.log(data)
                renderCountry(data[0])
            })
        })
}

// Call the function with 'pakistan' as the country name
// This triggers the async fetch operation
getCountryData('pakistan')