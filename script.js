let btn = document.getElementById('searchButton');
let search = document.getElementById('bookInput');
let showbook = document.getElementById('showbook');
let genreselect = document.getElementById('genre-select');
let clicked = false;

btn.addEventListener("click", handleSearchButtonClick);
genreselect.addEventListener('change', handleGenreSelectChange);
document.addEventListener('click', handleDocumentClick);


async function handleSearchButtonClick() {
    genreselect.value = '';
    if (search.value === '') {
        alert("Please enter something");
        return;
    }

    const bookName = search.value; 
    const bookDetails = await fetchBookDetails(bookName);
    if (bookDetails) {
        console.log("Fetch Book Details:", bookDetails);
        const fetchDatasDiv = document.querySelector('#cards');

        if (fetchDatasDiv) {
            fetchDatasDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

async function fetchBookDetails(bookName) {
    const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=' + encodeURIComponent(bookName);
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        if (data.items && data.items.length > 0) {
            renderBookDetails(data.items);
            return true;
        } else {
            alert("No Books Found");
            console.log('No book found with that name.');
            return null; 
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; 
    }
}

async function handleGenreSelectChange() {
    genre = genreselect.value;
    search.value = '';

    const fetchDatasDiv = document.querySelector('.fetch-datas');
    const headingDiv = fetchDatasDiv.querySelector('.headingdiv');
    const authorDescriptionDiv = fetchDatasDiv.querySelector('.author-description');
    const imageDetailsDiv = fetchDatasDiv.querySelector('.image-details');

    const bookDetails = await getFilterBooks(genre);
    if (bookDetails) {
        console.log("Filter Book Details:", bookDetails);
  
        headingDiv.innerHTML = '';
        authorDescriptionDiv.innerHTML = '';
        imageDetailsDiv.innerHTML = '';
        renderBookDetails(bookDetails);

        if (fetchDatasDiv) {
            fetchDatasDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

async function getFilterBooks(genre) {
    const genreUrl = 'https://www.googleapis.com/books/v1/volumes?q=subject:' + encodeURIComponent(genre);

    try {
        let response = await fetch(genreUrl);
        let data = await response.json();
        console.log("Filter :", data.items)
        if (data.items && data.items.length > 0) {
            return data.items;
        } else {
            console.log('No book found with that name.');
            return null; 
        }
    } catch (err) {
        console.log("Fetching Err", err);
    }
}

// function renderBookDetails(bookDetails) {
//     const cards = document.getElementById('cards');
//     cards.innerHTML = '';

//     bookDetails.forEach((data) => {
//         console.log('data', data);

//         let div = document.createElement('div');
//         div.classList.add('bookcards');

//         const bookNameHeading = document.createElement('h1');
//         bookNameHeading.textContent = data.volumeInfo.title;

//         const authorElement = document.createElement('p');
//         authorElement.textContent = "Author: " + data.volumeInfo.authors;

//         const imageElement = document.createElement('img');
//         imageElement.src = data.volumeInfo.imageLinks.smallThumbnail; 

//         div.appendChild(imageElement);
//         div.appendChild(bookNameHeading);
//         div.appendChild(authorElement);
//         div.addEventListener('click', () => {
//             showBook(data);
//         });
//         cards.appendChild(div);
//     });
// }
function renderBookDetails(bookDetails) {
    const cards = document.getElementById('cards');
    cards.innerHTML = '';

    bookDetails.forEach((data) => {
        console.log('data', data);

        let div = document.createElement('div');
        div.classList.add('bookcards');

        const bookNameHeading = document.createElement('h1');
        bookNameHeading.textContent = data.volumeInfo.title;

        const authorElement = document.createElement('p');
        authorElement.textContent = "Author: " + data.volumeInfo.authors;

        const ratingElement = document.createElement('p');
        ratingElement.textContent = "Rating: " + (data.volumeInfo.averageRating || 'N/A');

        const publisherElement = document.createElement('p');
        publisherElement.textContent = "Publisher: " + (data.volumeInfo.publisher || 'Unknown');

        const imageElement = document.createElement('img');
        imageElement.src = data.volumeInfo.imageLinks.smallThumbnail; 

        div.appendChild(imageElement);
        div.appendChild(bookNameHeading);
        div.appendChild(authorElement);
        div.appendChild(ratingElement);
        div.appendChild(publisherElement);
        div.addEventListener('click', () => {
            showBook(data);
        });
        cards.appendChild(div);
    });
}


function showBook(data) {
    console.log('Show Book');
    cards.style.display = '';
    showbook.innerHTML = '';

    const book = data.volumeInfo;

    let title = document.createElement('h1');
    title.textContent = book.title;

    let author = document.createElement('h3');
    author.textContent = book.author;

    let image = document.createElement('img');
    image.src = book.imageLinks.smallThumbnail;

    let des = document.createElement('p');
    des.textContent = book.description;

    showbook.appendChild(title);
    showbook.appendChild(author);
    showbook.appendChild(des);
    showbook.appendChild(image);
    showbook.style.display = 'block';

    clicked = false;
}

function handleDocumentClick(event) {
    if (!event.target.closest('.bookcards') && event.target !== showbook && !event.target.closest('#showbook')) {
        showbook.style.display = 'none';
    }
}


showbook.style.display = 'none';