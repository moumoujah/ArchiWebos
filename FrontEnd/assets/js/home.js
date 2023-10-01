const worksLocal = localStorage.getItem('works')
const works = JSON.parse(worksLocal)

async function LocalStorage() {
    try {
        const response = await fetch("http://localhost:5678/api/works"); 
        const worksApi = await response.json(); 

        if (JSON.stringify(worksApi) !== worksLocal) {
            localStorage.setItem('works', JSON.stringify(worksApi));
            console.log('Les données ont été mises à jour dans le localStorage.');
        } else {
            console.log('Les données sont à jour dans le localStorage.');
        }

    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
    }
}

LocalStorage();
console.log(works)

document.addEventListener("DOMContentLoaded", function () {
    genererWorks(works)

    const portfolioLI = document.querySelectorAll('#portfolio li');

    portfolioLI.forEach(function (li) {
        li.addEventListener('click', function () {
            const liActive = document.querySelector(".li-active");
            if (liActive) {
                liActive.classList.remove("li-active");
            }
            li.classList.add("li-active");
            const categoryName = li.getAttribute('data-category-name');
            filterItems(categoryName);

        });
    });
});


function filterItems(categoryName) {

    let filteredWorks;
    if (categoryName === 'all') {
        genererWorks(works)
    } else {
        filteredWorks = works.filter(work => work.category.name == categoryName);
        genererWorks(filteredWorks)
    }
}


function genererWorks(works) {
    const Gallery = document.querySelector(".gallery")
    Gallery.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        workElement.dataset.categoryName = works[i].category.name;
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const figcaptionElement = document.createElement("figcaption")
        figcaptionElement.innerHTML = figure.title;
        Gallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(figcaptionElement);
    }
}
   

document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('Token')

    if (isLoggedIn) {
        logout()
        headerLogin()
        editWorks()
        deleteFilter()
        Modal()
    }
});


function headerLogin() {
    const newDiv = document.createElement("div");
    newDiv.className = "login-header";
    newDiv.innerHTML = `<a><i class="fa-regular fa-pen-to-square"></i>Mode edition<a>`
    const bodyElement = document.querySelector("body");
    bodyElement.parentNode.insertBefore(newDiv, bodyElement);

}


function logout() {

    const loginElement = document.getElementById("login");
    loginElement.innerText = "logout";
    loginElement.addEventListener("click", (event) => {
        event.preventDefault()
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("Token")
        window.location.reload()
    })
}


function editWorks(){
const title = document.querySelector("#portfolio h2")
modifier = document.createElement("a");
modifier.id = "openModal"
modifier.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Modifier`
title.appendChild(modifier)
}

function deleteFilter() {

    const ulElement = document.querySelector('#portfolio ul');
    const parentElement = ulElement.parentNode;

    parentElement.removeChild(ulElement); 
}