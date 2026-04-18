// Get the current URL's search parameters
const params = new URLSearchParams(window.location.search);

// Get the specific 'inv' value
const invValue = params.get('inv'); 

document.getElementById('nmtamu').innerHTML = invValue; 