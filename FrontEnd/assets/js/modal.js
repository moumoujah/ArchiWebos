
function Modal() {
    createModal()
    openAndClose()
    ModalWorks(editWorks)
}

function createModal() {
    const modal = document.createElement("div");
    modal.id = "Modal"
    modal.classList.add("modal")
    modal.innerHTML =
        `	
    <div class="modal-main">
        <span class="after"><i class="fa-solid fa-arrow-left"></i></span>
        <span id="closeModal" class="close">&times;</span>
        <h2>Galerie Photo</h2>
        <input type="submit" value="Ajouter une photo">               
    </div> `
    document.body.appendChild(modal);
}


function openAndClose() {

    const openModal = document.getElementById('openModal');
    const modal = document.getElementById('Modal');
    const closeModal = document.querySelector('#closeModal');
    openModal.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
