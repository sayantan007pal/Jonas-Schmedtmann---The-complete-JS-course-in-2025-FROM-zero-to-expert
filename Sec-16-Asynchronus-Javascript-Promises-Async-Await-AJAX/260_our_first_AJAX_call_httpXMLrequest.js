//to run this code, we need to run a local server because of CORS policy. We can use the "serve" package for that. First, we need to install it globally using npm, and then we can run it in the directory where our code is located.
// cd "/Users/sayantanpal100/Desktop/Udemy Projects/Jonas-Schmedtmann---The-complete-JS-course-in-2025-FROM-zero-to-expert/Sec-16-Asynchronus-Javascript-Promises-Async-Await-AJAX"
// npx serve

function getCountryData(country){
const request = new XMLHttpRequest()
request.open('GET', `https://restcountries.com/v2/name/${country}`)
request.send()

request.addEventListener('load', function(){
    const [data] = JSON.parse(this.responseText)
    console.log(data)
    const html = `
        <article class ="country">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(data.population/1000000).toFixed(1)}M people</p>
                <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
                <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
        </article>
    `
    // insertAdjacentHTML('beforeend', html) - Inserts the HTML string as the last child inside document.body
    // 'beforeend' position means: just inside the element, after its last child
    // Other positions: 'beforebegin' (before element), 'afterbegin' (first child), 'afterend' (after element)
    document.body.insertAdjacentHTML('beforeend', html)

    // querySelector('.country') - Selects the first element with class "country"
    // Setting opacity to 1 makes the element fully visible (0 = invisible, 1 = fully visible)
    // This is often used with CSS transitions for fade-in effects
    document.querySelector('.country').style.opacity = 1
})

}

getCountryData('india')
getCountryData('usa')