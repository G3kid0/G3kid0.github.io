// === INITIALISATION FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyBGXjguIegEK6bZl_u7kzBUVku8oJXcCPM",
  authDomain: "frenchies-4d63a.firebaseapp.com",
  databaseURL: "https://frenchies-4d63a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "frenchies-4d63a",
  storageBucket: "frenchies-4d63a.appspot.com",
  messagingSenderId: "270761793230",
  appId: "1:270761793230:web:b4914660a81023dce1229f"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const addIconButton = document.getElementById('addIcon');
const container = document.getElementById('iconContainer');
const popup = document.getElementById('popup');
const imgFileInput = document.getElementById('imgFile');
const iconTextInput = document.getElementById('iconText');
const applyBtn = document.getElementById('applyChanges');
const closeBtn = document.getElementById('closePopup');

let currentIcon = null;

addIconButton.addEventListener('click', () => {
  const icon = createIcon('', '', 100, 100);
  container.appendChild(icon);
});

function createIcon(imgSrc, text, left, top) {
  const icon = document.createElement('div');
  icon.className = 'icon';
  icon.style.left = left + 'px';
  icon.style.top = top + 'px';

  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    icon.appendChild(img);
  }

  if (text) {
    const span = document.createElement('span');
    span.textContent = text;
    icon.appendChild(span);
  }

  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIcon = icon;
    imgFileInput.value = '';
    iconTextInput.value = icon.querySelector('span')?.textContent || '';
    popup.classList.remove('hidden');
  });

  makeDraggable(icon);
  return icon;
}

applyBtn.addEventListener('click', () => {
  if (!currentIcon) return;

  currentIcon.querySelector('img')?.remove();
  currentIcon.querySelector('span')?.remove();

  const file = imgFileInput.files[0];
  const text = iconTextInput.value.trim();
  const x = parseInt(currentIcon.style.left);
  const y = parseInt(currentIcon.style.top);

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      currentIcon.appendChild(img);

      if (text) {
        const span = document.createElement('span');
        span.textContent = text;
        currentIcon.appendChild(span);
      }

      saveIcon(img.src, text, x, y);
    };
    reader.readAsDataURL(file);
  } else {
    if (text) {
      const span = document.createElement('span');
      span.textContent = text;
      currentIcon.appendChild(span);
    }
    saveIcon('', text, x, y);
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

function saveIcon(imgSrc, text, x, y) {
  const newIconRef = db.ref('icons').push();
  newIconRef.set({ img: imgSrc, text, x, y });
}

function loadIcons() {
  db.ref('icons').once('value', (snapshot) => {
    snapshot.forEach((child) => {
      const data = child.val();
      const icon = createIcon(data.img, data.text, data.x, data.y);
      container.appendChild(icon);
    });
  });
}

loadIcons();
