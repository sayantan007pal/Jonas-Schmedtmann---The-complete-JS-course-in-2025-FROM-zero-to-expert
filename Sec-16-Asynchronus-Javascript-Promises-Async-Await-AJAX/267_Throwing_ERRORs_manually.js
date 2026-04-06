/**
 * LESSON: Throwing Errors Manually in Promise Chains
 *
 * Problem with fetch():
 *   fetch() only rejects its Promise on network failures (e.g., no internet).
 *   A 404 or 500 HTTP error does NOT cause a rejection — fetch() still resolves!
 *   So we must manually check response.ok and throw an Error ourselves.
 *
 * Key concepts covered:
 *   - throw new Error()     → manually reject a Promise mid-chain
 *   - .catch()              → handles any rejection from ANY .then() above it
 *   - .finally()            → always runs after the Promise settles (resolved or rejected)
 */

// Select the container div where country cards will be rendered
// Starts with opacity: 0 (hidden) in the HTML; revealed in .finally()
const countriesContainer = document.querySelector('.countries')

/**
 * Builds and inserts a country card into the DOM
 *
 * @param {Object} data       - Country object from the REST Countries API
 * @param {string} className  - Extra CSS class; pass 'neighbour' for border countries
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
    // 'beforeend' inserts the card as the last child inside countriesContainer
    countriesContainer.insertAdjacentHTML('beforeend', html)
}

/**
 * Displays a user-friendly error message in the DOM
 *
 * @param {string} msg - The error message to display
 *
 * Called from .catch() so the user sees what went wrong
 * instead of the page silently failing.
 */
const renderError = function(msg) {
    document.body.insertAdjacentHTML('beforeend', `<p style="color: red;">${msg}</p>`)
}

/**
 * Fetches and renders data for a given country name
 *
 * Promise chain flow:
 *   fetch()          → returns a Promise<Response>
 *   .then() #1       → checks for HTTP errors, then parses JSON  → returns Promise<data>
 *   .then() #2       → receives parsed data array, renders the country card
 *   .catch()         → catches ANY error thrown in the chain above (network OR manual throw)
 *   .finally()       → always runs last; fades in the container
 *
 * @param {string} country - Country name to search (e.g. 'pakistan')
 */
const getCountryData = function (country) {
    fetch(`https://restcountries.com/v2/name/${country}`)
        .then(function (response) {
            console.log(response)

            // ⚠️ KEY CONCEPT: fetch() does NOT reject on 4xx/5xx HTTP errors.
            // response.ok is false when the status code is outside 200–299.
            // We manually throw an Error here to force the Promise to reject,
            // which skips all remaining .then() calls and jumps to .catch().
            if (!response.ok) {
                throw new Error(`Country not found (${response.status})`)
            }

            // response.json() reads and parses the response body as JSON.
            // It also returns a Promise, so we return it to keep the chain going.
            return response.json()
        })
        .then(function (data) {
            // data is an array; index [0] is the first (and usually only) match
            console.log(data)
            renderCountry(data[0])
        })
        .catch(function (err) {
            // .catch() handles rejections from ANY .then() above it:
            //   • Network failure  → fetch() rejects automatically
            //   • 404 / 500 error  → we threw manually with throw new Error()
            // err.message contains the string passed to new Error(...)
            console.error(`${err} 💥💥💥`)
            renderError(`Something went wrong 💥💥 ${err.message}. Try again!`)
        })
        .finally(function () {
            // .finally() runs whether the Promise was resolved OR rejected.
            // Perfect for cleanup tasks like hiding spinners or, here,
            // fading in the container (even if it only contains an error message).
            countriesContainer.style.opacity = 1
        });
}

// Valid country → renders a country card
getCountryData('pakistan')

// Invalid country → server returns 404 → manual throw → .catch() renders error message
getCountryData('asdasdasd')