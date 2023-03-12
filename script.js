const apiKey = '4y2AY436K5iW4TneosAS0hJAWS3WsUogrshvi56U'
const count = 10
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`

let resultsArray = []
let favorites = {}

const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imagesContainer = document.querySelector('.images-container')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')
// Get 10 images from NASA Api

function showContent(page){
  if(page === 'favorites'){
    favoritesNav.classList.remove('hidden')
    resultsNav.classList.add('hidden')
  }else{
    resultsNav.classList.remove('hidden')
    favoritesNav.classList.add('hidden')
  }
  // scroll to top of page
  window.scrollTo({top:0,behavior: 'instant'})
  loader.classList.add('hidden')
}

function createDOMNodes(page) {
  // Load ResultsArray or Favorites
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
  // console.log(currentArray)
  currentArray.forEach((result) => {
    console.log(result)
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');
    // Link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';
    // Image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // Card Title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    // Save Text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'results') {
      saveText.textContent = 'Add To Favorites';
      saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = 'Remove Favorite';
      saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    // Date
    const date = document.createElement('strong');
    date.textContent = result.date;
    // Copyright
    const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function removeFavorite(url){
  if(favorites[url]){
    delete favorites[url]
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

function updateDOM(page){
  imagesContainer.textContent = ''
  // Get favorites from local storage
  if(localStorage.getItem('nasaFavorites')){
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    console.log(favorites)
  }
  createDOMNodes(page);
  showContent(page)
}

// save favorite
function saveFavorite(itemUrl){
  // Loop through resultsArray[result].items to select favorite
  resultsArray.forEach((item)=>{
    if(item.url.includes(itemUrl) && !favorites[itemUrl]){
      favorites[itemUrl] = item
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
      // show save confirmation for 2 seconds
      saveConfirmed.classList.remove('hidden')
      setTimeout(()=>{
        saveConfirmed.classList.add('hidden')
      },2000)
    }
  })
}

async function getNasaPictures(){
  loader.classList.remove('hidden')
  try{
    const response = await fetch(apiUrl)
    resultsArray = await response.json()
    updateDOM('results');
  }catch(e){
    console.log(e)
  }
}

// On load
getNasaPictures()

