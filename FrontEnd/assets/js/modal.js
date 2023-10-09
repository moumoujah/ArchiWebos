function Modal() {
    createModal()
    openAndClose()
    changeModal()
    ModalWorks(editWorks)
    trash();
    buttonValidate()
    addPicture()
    storage()
   
   
    
    
}

function createModal() {//fonction qui permet de créer la modal

    const modal = document.createElement("div");
    modal.id = "Modal"
    modal.classList.add("modal")
    modal.innerHTML =
        `	
    <div class="modal-main"> 
        <span class="after"><i class="fa-solid fa-arrow-left"></i></span>
        <span id="closeModal" id="sendApi" class="close">&times;</span>
        <h2>Galerie Photo</h2>
        <div class="modal-body">
            <ul class="gallery-modal"></ul>
                    
            <form id="pictures" action="traitement.php" method="post" enctype="multipart/form-data">
                <div class="download-modal2">
                    <div class="img-add">
                        <img id="imageDownload" src="" alt="Image affichée">
                    </div>
                    <i class="fa-regular fa-image"></i>
                    <label for="photo" class="custom-file-input">
                        <span id="custom-text">+ Ajouter photo</span>
                        <input type="file" id="photo" name="photo" accept="image/*" required>
                    </label>
                    <p>jpg, png : 4mo max<p>
                </div>
                <label for="titre">Titre</label>
                <input type="text" id="titre" name="titre" required>
                <label for="categorie">Catégorie</label>
                <select id="categorie" name="categorie">
                <option value="1"></option>
                    <option value="2">Objets</option>
                    <option value="3">Appartements</option>
                    <option value="4">Hôtels & restaurants</option>
                </select> 
            </form>
        </div>
        <input id="addPict" type="submit" value="Ajouter une photo"><input id="validate" type="submit" value="valider">                   
        <a></a>
    </div> `
    document.body.appendChild(modal);
}
document.addEventListener("DOMContentLoaded", function () {// Attendre que le DOM soit charger 
    storage()
});
function openAndClose() { //fonction pour ouvrir et fermer la modal
    const openModal = document.getElementById('openModal');
    const modal = document.getElementById('Modal');
    const closeModal = document.querySelector('#closeModal');
    openModal.addEventListener('click', () => {
        modal.style.display = 'block';
        document.getElementById('titre').value = '';
        storage()
        
    });
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('titre').value = '';
        storage()
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            document.getElementById('titre').value = '';
            modal.style.display = 'none';
            storage()
        }
    });
   
    
}

function changeModal() { //fonction pour changer l'apparence de la modal (supprimer projet et ajouter un projet)
    const addPict = document.getElementById('addPict')

    addPict.addEventListener('click', () => {
        addPict.style.display = "none"
        document.querySelector('.modal a').style.display = "none"
        document.querySelector(".gallery-modal").style.display = "none"
        document.querySelector('.modal h2').innerText = "Ajout photo"
        document.querySelector('.after').style.display = "block"
        document.getElementById('validate').style.display = "block"
        document.getElementById('pictures').style.display = 'flex'
        updateButtonSubmit();
    })
    const after = document.querySelector(".after")

    after.addEventListener('click', () => {
        document.querySelector('.after').style.display = "none"
        document.getElementById('pictures').style.display = "none"
        document.getElementById('validate').style.display = "none"
        document.querySelector('.modal h2').innerText = "Galerie Photo"
        document.getElementById('addPict').style.display = "block"
        document.querySelector('.modal a').style.display = "block"
        document.querySelector(".gallery-modal").style.display = "block"
    })
}


function ModalWorks(works) {//fonction qui permet d'afficher les projet dans la modal
    const divGallery = document.querySelector(".gallery-modal")
    divGallery.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        const li = works[i];
        const workElement = document.createElement("li");
        workElement.dataset.id = works[i].id;
        workElement.dataset.categoryId = works[i].categoryId;
        const imageElement = document.createElement("img");
        imageElement.src = li.imageUrl;
        const trashElement = document.createElement("div")
        trashElement.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
        divGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(trashElement)
    }
}
 

function trash() {//fonction pour supprimer des projet dans la modal assoccier a la fonction removeElement
    let trashIcons = document.querySelectorAll(".fa-trash-can");
    trashIcons.forEach((icon, index) => {
        icon.addEventListener("click", () => {
            removeElement(index);
            updatetrash();
            storage()
            
            
        });
    });
}

function removeElement(index) {//fonction qui permet de supprimer les projets et de regénérer les projets sans celui supprimer
    editWorks.splice(index, 1);
    localStorage.setItem("editWorks", JSON.stringify(editWorks));
    localStorage.setItem('works', JSON.stringify(editWorks));
        const deletions = works.filter(work => !editWorks.some(editWork => editWork.id === work.id));
        for (const deletion of deletions) {
            const deleteURL = `${APIWORK}/${deletion.id}`;

            fetch(deleteURL, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        console.log(`L'image avec l'ID ${deletion.id} supprimé.`);
                    } else {
                        console.error(`Échec de la suppression de l'image avec l'ID ${deletion.id}.`);
                    }
                })
                .catch(error => {
                    console.error(`Erreur lors de la suppression de l'image avec l'ID ${deletion.id}:`, error);
                });
        }
    ModalWorks(editWorks);
    genererWorks(editWorks);
    
    
    
}
function updatetrash() {
    let trashIcons = document.querySelectorAll(".fa-trash-can");
    trashIcons.forEach(icon => {
        icon.removeEventListener("click", removeElement);
    });
    trash();
}



const tableauDonnees = [];//tableau pour les nouveau projet

let imageUrl = null; 

function updateButtonSubmit() {//fonction pour mettre le boutton de validation en vert une fois un tire et une image déposer
    const photoInput = document.getElementById("photo");
    const titreInput = document.getElementById("titre");
    const categorieInput = document.getElementById("categorie");
    const validate = document.getElementById('validate')

    if (photoInput.value.trim() !== '' && titreInput.value.trim() !== '' && categorieInput.value.trim() !== '1') {
        validate.disabled = false;
        validate.style.backgroundColor = "#1D6154"
    } else {
        validate.disabled = true;
        validate.style.backgroundColor = "grey"
    }
}

function buttonValidate() {//fonction qui permet de de rendre visible la photo déposer vérifier sont format et sa taille valide
    const imageDownload = document.getElementById("imageDownload");
    const photoInput = document.getElementById("photo");
    const pictures = document.getElementById('pictures')
    pictures.addEventListener('input', () => {
        updateButtonSubmit();
    });

    photoInput.addEventListener("change", function (event) {
        const selectedImage = event.target.files[0];
        const validImageMimeTypes = ["image/jpeg", "image/png"]; 
        if (!validImageMimeTypes.some(type => selectedImage.type === type)) {
            alert("Veuillez déposer une image au format JPEG ou PNG.");
            event.target.value = ""; 
            return;
        }

        else if (selectedImage.size <= 4000000) {
            imageUrl = URL.createObjectURL(selectedImage);
            imageDownload.src = imageUrl;
            document.querySelector('.img-add').style.display = "block"
            document.querySelector('#pictures div i').style.display = "none"
            document.querySelector('#pictures div label').style.display = "none"
            document.querySelector('#pictures div p').style.display = "none"

        } else {
            alert("L'image doit avoir taille inférieure à 4 Mo.");
            event.target.value = ""; 
        }
        
        
    });
}


function addPicture() { 
    const validate = document.getElementById('validate')
    const pictures = document.getElementById('pictures')
    const photoInput = document.getElementById("photo");
    const titreInput = document.getElementById("titre");
    const categorieSelect = document.getElementById("categorie");

    validate.addEventListener('click', (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("image", photoInput.files[0]);
        formData.append("title", titreInput.value);
        formData.append("category", categorieSelect.value);
        const imageArray = { "imageUrl": imageUrl, "title": titreInput.value }
        editWorks.push(imageArray)
        tableauDonnees.push(formData);
        ModalWorks(editWorks)
        genererWorks(editWorks) 
        trash();
        document.querySelector('.img-add').style.display = "none"
        document.getElementById('titre').value = '';
        document.querySelector('#pictures div i').style.display = "block"
        document.querySelector('#pictures div label').style.display = "flex"
        document.querySelector('#pictures div p').style.display = "block"
        document.querySelector('.after').style.display = "none"
        document.getElementById('pictures').style.display = "none"
        document.getElementById('validate').style.display = "none"
        document.querySelector('.modal h2').innerText = "Galerie Photo"
        document.getElementById('addPict').style.display = "block"
        document.querySelector('.modal a').style.display = "block"
        document.querySelector(".gallery-modal").style.display = "block"
        
           
        updateButtonSubmit()
        newpicture()
        
    });
}



async function newpicture() {
    try {
        for (const formData of tableauDonnees) {
            const response = await fetch(APIWORK, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            console.log("Réponse de l'API :", data);
        }
    } catch (error) {
        console.error("Erreur:", error);
    }
}