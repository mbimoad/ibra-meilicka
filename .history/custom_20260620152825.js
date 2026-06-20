// Get the current URL's search parameters
const params = new URLSearchParams(window.location.search);

// Get the specific 'inv' value
const invValue = params.get('inv'); 
const malePria = params.get('fam'); 

if(malePria != null) {
    
}
if(malePria.toLowerCase() == "true") {
    document.querySelectorAll('#male_pria').forEach(item => item.innerHTML = 'Adam')
}

document.getElementById('nmtamu').innerHTML = invValue; 


setTimeout(() => {
    document.querySelector('.bmoloader').classList.add('hiding')
}, 1000);

