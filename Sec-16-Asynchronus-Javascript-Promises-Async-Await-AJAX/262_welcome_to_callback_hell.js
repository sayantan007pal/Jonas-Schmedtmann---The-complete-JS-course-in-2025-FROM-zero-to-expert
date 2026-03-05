function getCountryData(data){
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
}

function getCountryAndNeighbour(country){
    //AJAX Call country 1
    const request = new XMLHttpRequest()
    request.open('GET', `https://restcountries.com/v2/name/${country}`)
    request.send()

    request.addEventListener('load', function(){
        const [data] = JSON.parse(this.responseText)
        console.log(data)
        //get country 1 data
        getCountryData(data)

        //getneighbour country
        const neighbour = data.borders ? data.borders[0] : null

        if(!neighbour) return

        const request2 = new XMLHttpRequest()
        request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`)
        request2.send()

        request2.addEventListener('load', function(){
            const data2 = JSON.parse(this.responseText)
            console.log(data2)
            //get country 2 data
            getCountryData(data2)
        })
    })
}

getCountryAndNeighbour('pakistan')