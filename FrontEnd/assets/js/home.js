document.addEventListener("DOMContentLoaded", function () {// Attendre que le DOM soit charger 
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    storage()

    if (isLoggedIn) {//si l'utilisateur est connecté lance les fonctions
        loginStorage()
        loginView()
        Modal()
    } else {
        logoutFilter() //s'il n'est pas connecté met les filtres des projets
    }
});


const APIWORK = "http://localhost:5678/api/works"

let worksLocal;
let works;

function storage() {
    if (localStorage.getItem('works')) { //si le works existe dans le le localstorage génère le
        worksLocal = localStorage.getItem('works');
        works = JSON.parse(worksLocal);
        genererWorks(works)
        updateLocalStorage()
    } else {
        updateLocalStorage();//sinon met le à jour
    }
}

async function updateLocalStorage() {//vérifie si les données de l'API sont égal au localstorage
    try {
        const response = await fetch(APIWORK);
        const worksApi = await response.json();

        if (JSON.stringify(worksApi) !== worksLocal) {
            worksLocal = JSON.stringify(worksApi)
            works = JSON.parse(worksLocal);
            localStorage.setItem('works', worksLocal);
            console.log('Données ont été mises à jour.');
            genererWorks(works)
        } else {
            console.log('Les données correspondent à celle de l\'api.');
            genererWorks(works)
        }

    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    }
}

function genererWorks(works) {       //génère les projets (images) 
    const divGallery = document.querySelector(".gallery")
    divGallery.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        workElement.dataset.categoryId = works[i].categoryId;
        const imageElement = document.createElement("img");
        imageElement.src = works[i].imageUrl;
        const figcaptionElement = document.createElement("figcaption")
        figcaptionElement.innerHTML = works[i].title;

        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(figcaptionElement);
    }
}

function logoutFilter() { //fonction qui permet de filtrer les projet par catégories avec les buttons
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(data => {
            const ulElement = document.querySelector('#portfolio ul');
            data.forEach(category => {
                const liElement = document.createElement('li');
                liElement.setAttribute('data-category-id', category.id);
                liElement.textContent = category.name;
                ulElement.appendChild(liElement);
            });
            listenFilter()
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données :', error);
        });
}

//fonction qui permet d'écouter lorsque l'on click sur un boutton afin d'afficher les bon projets avec leurs catégorie
function listenFilter() { 
    const liElements = document.querySelectorAll('#portfolio li');

    liElements.forEach(function (li) {
        li.addEventListener('click', function () {
            document.querySelector(".li-active").classList.remove("li-active");//change le background du boutton sur celui qu'on a cliquer
            li.classList.add("li-active");
            const categoryId = li.getAttribute('data-category-id');
            if (categoryId === '0') {
                genererWorks(works)
            } else {
                let filteredWorks;
                filteredWorks = works.filter(work => work.categoryId == categoryId);
                genererWorks(filteredWorks)
            }

        });
    });
}
//utilisateur connnecté
let editWorks;
let token;
function loginStorage() { 
    token = localStorage.getItem('token')
    editWorks = [...works]
}

function loginView() {//changement de l'apparence de la page (header,button des filtresetc...) quand l'utilisateur est connecté
    const newHeader = document.createElement("div");
    newHeader.className = "login-header";
    newHeader.innerHTML = `<a><i class="fa-regular fa-pen-to-square"></i>Mode edition<a>`
    const bodyElement = document.querySelector("body");
    bodyElement.parentNode.insertBefore(newHeader, bodyElement);
    document.querySelector('#portfolio ul').style.display = "none"
    const title = document.querySelector("#portfolio h2")
    modifier = document.createElement("a");
    modifier.id = "openModal"
    modifier.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Modifier`
    title.appendChild(modifier)
    const loginElement = document.getElementById("login");
    loginElement.innerText = "logout";
    loginElement.addEventListener("click", (event) => {
        event.preventDefault()
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token")
        window.location.reload()
    })
}

