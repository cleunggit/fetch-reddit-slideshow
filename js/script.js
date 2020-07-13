// declare global variables and constants
const API_URL = 'https://www.reddit.com/search.json?nsfw=no&q='
const INTERVAL_DELAY = 2500
let currentImages = []
let currentIndex = 0
let interval = null

// declare event listeners
// form submit
document.getElementById('search-form').addEventListener('submit', e => {
    // prevent teh form from refreshing the page
    e.preventDefault()

    // get the user's input from the textbox
    let userQuery = document.getElementById('query').value

    // make sure the user actually typed something
    if (userQuery) {
        fetchReddit(userQuery)
        //  TODO: create fetchReddit function
        
        // empty the form
        document.getElementById('query').value = ''
    }
    else {
        console.log('the search is empty')
    }
})

// stop button click
document.getElementById('stop-button').addEventListener('click', () => {
    // hide the results
    document.getElementById('slideshow-container').style.visibility = 'hidden'

    // show the search form
    document.getElementById('form-container').style.display = 'block'

    // clear the interval
    clearInterval(interval)
})

// helper functions
const fetchReddit = query => {
    console.log('Performing fetch', query)

    // call the Reddit API with AJAX call (using fetch function)
    fetch(API_URL + query)
    .then(response => response.json())
    .then(jsonData => {
        // pair down the object to what I need
        currentImages = jsonData.data.children.map(p => {
            return {
                title: p.data.title,
                url: p.data.url,
                subreddit: p.data.subreddit,
                upvotes: p.data.ups,
                gold: p.data.gilded > 0 ? true : false,
                posthint: p.data.post_hint
            }
        }).filter(p => {
            return p.posthint === 'image'
        })
        console.log('Cleaned up posts', currentImages)
        // start the slideshow
        startSlideShow()
    })
    .catch(err => {
        console.log('ERROR', err)
    })
}

const startSlideShow = () => {
    console.log('Starting slides')
    // set current index to zero (first pic)
    currentIndex = 0

    // set up the first image (so we don't have to wait)
    placeImage()

    // hide the form container and show the slideshow container
    document.getElementById('form-container').style.display = 'none'
    document.getElementById('slideshow-container').style.visibility = 'visible'

    // start the interval
    interval = setInterval(changeImage, INTERVAL_DELAY)
}

const changeImage = () => {
    // increment the current index
    currentIndex++

    // check the bound of the array
    if (currentIndex >= currentImages.length) {
        currentIndex = 0
    }
    // replace the image
    placeImage()
}

const placeImage = () => {
    // empty the result div
    document.getElementById('result').textContent = ''

    // create an img tag
    let img = document.createElement('img')
    img.src = currentImages[currentIndex].url
    img.alt = currentImages[currentIndex].title

    // create an h2 to hold the title
    let h2 = document.createElement('h2')
    h2.textContent = currentImages[currentIndex].title + (currentImages[currentIndex].gold ? '🏆' : '')

    // create an h3 to hold the subreddit
    let h3 = document.createElement('h3')
    h3.textContent = 'r/' + currentImages[currentIndex].subreddit
    h3.style.fontWeight = 'bold'

    // add the created elements to the page (result div)
    document.getElementById('result').append(img)
    document.getElementById('result').append(h2)
    document.getElementById('result').append(h3)

}