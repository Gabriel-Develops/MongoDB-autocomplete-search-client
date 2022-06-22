// $(...) => Query Selector in jquery
$(document).ready(() => {
    $('#title').autocomplete({
        source: async (req, res) => {
            let reply = await fetch(`https://mongodb-movie-db-sample.herokuapp.com/search?query=${req.term}`)
            let results = await reply.json()
            let data = results.map(result => {
                console.log(results)
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
            console.log(event, ui)
            console.log(ui.item.id) // We want to pass in the id of the movie and not the name to prevent duplicates being confused
            fetch(`https://mongodb-movie-db-sample.herokuapp.com/get/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    $('#cast').empty()
                    result.cast.forEach(cast => $('#cast').append(`<li>${cast}</li>`))
                    $('img').attr('src', result.poster)
                })
        }
    })
})