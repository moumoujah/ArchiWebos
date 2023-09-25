document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('main-login');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.parentNode.removeChild(errorMessage);
        }
        connexion();
    });
});


async function connexion() {
    const emailValue = document.getElementById('email').value;
    const passwordValue = document.getElementById('password').value;
    const requestValue = {
        email: emailValue,
        password: passwordValue
    };

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestValue)
        });

        if (response.ok) {
            const data = await response.json(); 
            const token = data.token; 
            localStorage.setItem('token', token)
            localStorage.setItem('isLoggedIn', true);

            window.location.href = "index.html";

        } else if (response.status === 404 || response.status === 401) {
           const passwordInput = document.getElementById('password');
           const errorConnexion = document.createElement('div');
           errorConnexion.textContent = "Email ou mot de passe incorrect";
           
           passwordInput.parentNode.insertBefore(errorConnexion, passwordInput.nextSibling);

        } else {
            console.error('Échec de la connexion');
        }
    } catch (error) {

        console.error('Erreur réseau', error);
    }
}