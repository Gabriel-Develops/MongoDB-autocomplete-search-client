// $(...) => Query Selector in jquery
$(document).ready(() => {
    $('#title').autocomplete({
        source: async (req, res) => {
            let reply = await fetch(`https://mongodb-movie-db-sample.herokuapp.com/search?query=${req.term}`)
            let results = await reply.json()
            let data = results.map(result => {
                return {
                    label: `${result.title} (${result.year})`,
                    value: result.title,
                    id: result._id,
                }
            })
            res(data)
        },
        minLength: 0,
        select: (event, ui) => {
            // console.log(ui.item.id) // We want to pass in the id of the movie and not the name to prevent duplicates being confused
            fetch(`https://mongodb-movie-db-sample.herokuapp.com/get/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    movieToDom(result)
                })
        }
    })
})

document.querySelector('#random').addEventListener('click', fetchRandom)

async function fetchRandom() {
    let response = await fetch('https://mongodb-movie-db-sample.herokuapp.com/rand')
    let result = await response.json()
    console.log(result)
    movieToDom(result)
}

function movieToDom(result) {
    // Empties out movie information
    $('#movie-title').empty()
    $('#movie-quick-info').empty()
    $('#movie-cast').empty()
    $('#movie-image').empty()
    $('#imdb').empty()
    $('#imdb-rating').empty()
    $('#movie-production').empty()
    
    // Movie Title
    $('#movie-title').text(result.title)

    // Movie Date
    const releaseDate = new Date(result.released)
    $('#movie-quick-info').append(`<li>${releaseDate.getMonth()}/${releaseDate.getDate()}/${releaseDate.getFullYear()}</li>`)

    // Movie Genres (array)
    $('#movie-quick-info').append(`<li>${result.genres.join(', ')}</li>`)

    // Movie runtime
    let runtime = result.runtime
    $('#movie-quick-info').append(`<li>${Math.floor(runtime / 60)}h ${runtime % 60}m</li>`)

    // Movie cast       
    if (document.querySelector('#cast-tag').textContent === '')
        document.querySelector('#cast-tag').textContent = 'Cast'             
    result.cast.forEach(cast => $('#movie-cast').append(`<li>${cast}</li>`))

    // Movie poster
    const img = document.createElement('img')
    img.src = result.poster || 'https://mongodb-movie-db-sample.herokuapp.com/images/poster-holder.jpg'
    img.id = 'movie-poster'
    document.querySelector('#movie-image').append(img)

    // Movie rating
    // imdb logo and link
    const imdbAnchor = document.querySelector('#imdb')
    const imdbLogo = document.createElement('img')
    imdbLogo.src = `https://img.icons8.com/color/100/000000/imdb.png`

    let imdbId = result.imdb.id.toString()
    while (imdbId.length < 7) {
        imdbId = '0' + imdbId
    }
    imdbAnchor.href = `https://www.imdb.com/title/tt${imdbId}/`


    imdbAnchor.append(imdbLogo)

    // imdb rating
    document.querySelector('#imdb-rating').textContent = `${result.imdb.rating}/10`

    // Movie plot
    if (document.querySelector('#production-tag').textContent === '')
        document.querySelector('#production-tag').textContent = 'Production'

    document.querySelector('#movie-plot').textContent = result.fullplot

    // Movie Production team
    // (directors and writers)
    if (document.querySelector('#plot-tag').textContent === '')
        document.querySelector('#plot-tag').textContent = 'Storyline'
    
    const production = {}

    if ('directors' in result)
        result.directors.forEach(director => production[director] = 'Director')

    if ('writers' in result) {
        result.writers.forEach(writer => {
            if (writer in production)
                return production[writer] = `${production[writer]}, Writer`
            else
                return production[writer] = 'Writer'
        })
    }
    // console.log(production)
    
    for (const producer in production) {
        const li = document.createElement('li')
        const pName = document.createElement('p')
        pName.textContent = producer
        const pTitle = document.createElement('p')
        pTitle.textContent = production[producer]

        li.append(pName, pTitle)
        document.querySelector('#movie-production').append(li)
    }
}