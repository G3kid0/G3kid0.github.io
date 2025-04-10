

// Initialize Firebase


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔧 Ton code existant
const addIconButton = document.getElementById('addIcon');
const container = document.getElementById('iconContainer');

const popup = document.getElementById('popup');
const imgUrlInput = document.getElementById('imgUrl');
const iconTextInput = document.getElementById('iconText');
const applyBtn = document.getElementById('applyChanges');
const closeBtn = document.getElementById('closePopup');

let currentIcon = null;

function generateId() {
  return 'icon-' + Math.random().toString(36).substring(2, 9);
}

function saveIcon(id, data) {
  set(ref(db, 'icons/' + id), data);
}

function makeDraggable(el, id) {
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

    // Sauvegarder position
    const x = el.style.left;
    const y = el.style.top;
    const img = el.querySelector('img')?.src || '';
    const text = el.querySelector('span')?.textContent || '';
    saveIcon(id, { x, y, image: img, text });
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

addIconButton.addEventListener('click', () => {
  const id = generateId();
  const icon = document.createElement('div');
  icon.className = 'icon';
  icon.style.left = '100px';
  icon.style.top = '100px';
  icon.dataset.id = id;

  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIcon = icon;
    const img = icon.querySelector('img');
    const span = icon.querySelector('span');
    imgUrlInput.value = img ? img.src : '';
    iconTextInput.value = span ? span.textContent : '';
    popup.classList.remove('hidden');
  });

  makeDraggable(icon, id);
  container.appendChild(icon);
  saveIcon(id, { x: '100px', y: '100px', image: '', text: '' });
});

applyBtn.addEventListener('click', () => {
  if (!currentIcon) return;
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

  const id = currentIcon.dataset.id;
  const x = currentIcon.style.left;
  const y = currentIcon.style.top;
  saveIcon(id, { x, y, image: url, text });

  popup.classList.add('hidden');
  currentIcon = null;
});

closeBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
  currentIcon = null;
});
