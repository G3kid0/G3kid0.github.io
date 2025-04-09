// Initialisation de Firebase
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Fonction pour sauvegarder une icône dans Firebase
function saveIcon(id, iconData) {
    const db = getDatabase();
    set(ref(db, 'icons/' + id), iconData)
        .then(() => {
            console.log("Icône sauvegardée!");
        })
        .catch((error) => {
            console.error("Erreur lors de la sauvegarde de l'icône", error);
        });
}

// Fonction pour charger les icônes depuis Firebase
function loadIcons() {
    const db = getDatabase();
    const iconsRef = ref(db, 'icons/');
    onValue(iconsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(icon => {
                // Créer et afficher les icônes récupérées
                const el = document.createElement('div');
                el.className = 'icon';
                el.style.left = icon.x;
                el.style.top = icon.y;
                el.dataset.id = icon.id;
                
                if (icon.image) {
                    const img = document.createElement('img');
                    img.src = icon.image;
                    el.appendChild(img);
                }

                if (icon.text) {
                    const span = document.createElement('span');
                    span.textContent = icon.text;
                    el.appendChild(span);
                }

                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIcon = el;
                    imgUrlInput.value = icon.image || '';
                    iconTextInput.value = icon.text || '';
                    popup.classList.remove('hidden');
                });

                makeDraggable(el);
                container.appendChild(el);
            });
        }
    });
}

// Appeler la fonction pour charger les icônes existantes lors du démarrage
loadIcons();

// Fonction de gestion de la création des icônes
const applyBtn = document.querySelector('#apply');
applyBtn.addEventListener('click', () => {
    const url = imgUrlInput.value;
    const text = iconTextInput.value;
    if (!url) return;

    const currentIcon = document.createElement('div');
    currentIcon.className = 'icon';
    currentIcon.style.left = '100px'; // Position de départ
    currentIcon.style.top = '100px'; // Position de départ
    currentIcon.dataset.id = Date.now(); // Créer un ID unique

    const img = document.createElement('img');
    img.src = url;
    currentIcon.appendChild(img);

    if (text) {
        const span = document.createElement('span');
        span.textContent = text;
        currentIcon.appendChild(span);
    }

    // Sauvegarder l'icône dans Firebase
    saveIcon(currentIcon.dataset.id, {
        id: currentIcon.dataset.id,
        x: currentIcon.style.left,
        y: currentIcon.style.top,
        image: url,
        text: text
    });

    // Ajouter l'icône à l'écran
    container.appendChild(currentIcon);
    makeDraggable(currentIcon); // Rendre l'icône déplaçable
});
