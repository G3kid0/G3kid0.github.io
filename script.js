const addIconButton = document.getElementById('addIcon');
const container = document.getElementById('iconContainer');

const popup = document.getElementById('popup');
const imgUrlInput = document.getElementById('imgUrl');
const iconTextInput = document.getElementById('iconText');
const applyBtn = document.getElementById('applyChanges');
const closeBtn = document.getElementById('closePopup');

let currentIcon = null;

addIconButton.addEventListener('click', () => {
  const icon = document.createElement('div');
  icon.className = 'icon';
  icon.style.left = '100px';
  icon.style.top = '100px';

  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIcon = icon;
    const img = icon.querySelector('img');
    const span = icon.querySelector('span');
    imgUrlInput.value = img ? img.src : '';
    iconTextInput.value = span ? span.textContent : '';
    popup.classList.remove('hidden');
  });

  makeDraggable(icon);
  container.appendChild(icon);

  // Génère un ID unique pour chaque icône si elle n'en a pas encore
if (!currentIcon.dataset.id) {
  currentIcon.dataset.id = Date.now(); // timestamp unique
}
const id = currentIcon.dataset.id;

// Récupère les données
const iconData = {
  id: id,
  x: currentIcon.style.left,
  y: currentIcon.style.top,
  image: url,
  text: text
};

// Sauvegarde dans Firebase
db.ref('icons/' + id).set(iconData);

});

applyBtn.addEventListener('click', () => {
  if (!currentIcon) return;

  // Supprimer l'ancienne image ou span s'ils existent
  currentIcon.querySelector('img')?.remove();
  currentIcon.querySelector('span')?.remove();

  const url = imgUrlInput.value.trim();
  const text = iconTextInput.value.trim();

  if (url) {
    const img = document.createElement('img');
    img.src = url;
    currentIcon.appendChild(img);
  }

  if (text) {
    const span = document.createElement('span');
    span.textContent = text;
    currentIcon.appendChild(span);
  }

  popup.classList.add('hidden');
  currentIcon = null;
});

closeBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
  currentIcon = null;
});

function makeDraggable(el) {
  let offsetX, offsetY;

  const onMove = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    el.style.left = (x - offsetX) + 'px';
    el.style.top = (y - offsetY) + 'px';
  };

  const onUp = () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
  };

  el.addEventListener('mousedown', (e) => {
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  el.addEventListener('touchstart', (e) => {
    const rect = el.getBoundingClientRect();
    offsetX = e.touches[0].clientX - rect.left;
    offsetY = e.touches[0].clientY - rect.top;
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onUp);
  });
}

// Chargement des icônes au lancement
db.ref('icons').on('value', (snapshot) => {
  container.innerHTML = ''; // Réinitialiser
  const data = snapshot.val();
  if (!data) return;

  Object.values(data).forEach(icon => {
    const el = document.createElement('div');
    el.className = 'icon';
    el.dataset.id = icon.id;
    el.style.left = icon.x;
    el.style.top = icon.y;

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
});

