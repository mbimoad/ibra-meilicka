// Get the current URL's search parameters
const params = new URLSearchParams(window.location.search);

// Get the specific 'inv' value
const invValue = params.get('inv'); 
const malePria = params.get('fam'); 

if(malePria.toLowerCase() == "true") {
    document.querySelectorAll('#male_pria').forEach(item => item.innerHTML = 'Adam')
}

document.getElementById('nmtamu').innerHTML = invValue; 


setTimeout(() => {
    
}, 1000);

