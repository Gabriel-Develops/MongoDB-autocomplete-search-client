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
        minLength: 3,
        select: (event, ui) => {
            // console.log(ui.item.id) // We want to pass in the id of the movie and not the name to prevent duplicates being confused
            fetch(`https://mongodb-movie-db-sample.herokuapp.com/get/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    console.log(result)
                    // Empties out movie information
                    $('#movie-title').empty()
                    $('#movie-quick-info').empty()
                    $('#movie-cast').empty()
                    $('#imdb').empty()
                    $('#imdb-rating').empty()
                    
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
                    result.cast.forEach(cast => $('#movie-cast').append(`<li>${cast}</li>`))

                    // Movie poster
                    $('#movie-poster').attr('src', result.poster)

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
                    document.querySelector('#movie-plot').textContent = result.fullplot
                })
        }
    })
})