 
fetch("http://localhost:5678/api/users/login");
const worksLocal = localStorage.getItem('works')
const works = JSON.parse(worksLocal)

async function updateLocalStorage() {
    try {
        const response = await fetch("http://localhost:5678/api/works"); 
        const worksApi = await response.json(); 

        if (JSON.stringify(worksApi) !== worksLocal) {
            localStorage.setItem('works', JSON.stringify(worksApi));
            console.log('Données mises à jour dans le localStorage.');
        } else {
            console.log('Les données sont déjà à jour dans le localStorage.');
        }

    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    }
}

updateLocalStorage();
console.log(works)

document.addEventListener("DOMContentLoaded", function () {
    genererWorks(works)

    const liElements = document.querySelectorAll('#portfolio li');

    liElements.forEach(function (li) {
        li.addEventListener('click', function () {
            const activeLi = document.querySelector(".li-active");
            if (activeLi) {
                activeLi.classList.remove("li-active");
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
    const divGallery = document.querySelector(".gallery")
    divGallery.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        workElement.dataset.categoryName = works[i].category.name;
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const figcaptionElement = document.createElement("figcaption")
        figcaptionElement.innerHTML = figure.title;
        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(figcaptionElement);
    }
}
   






