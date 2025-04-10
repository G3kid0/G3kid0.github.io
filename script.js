// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBGXjguIegEK6bZl_u7kzBUVku8oJXcCPM",
  authDomain: "frenchies-4d63a.firebaseapp.com",
  databaseURL: "https://frenchies-4d63a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "frenchies-4d63a",
  storageBucket: "frenchies-4d63a.appspot.com",
  messagingSenderId: "270761793230",
  appId: "1:270761793230:web:b4914660a81023dce1229f"
};

// Initialiser Firebase
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
let currentKey = null;

// Charger les icônes depuis Firebase
firebase.database().ref('icons').on('value', (snapshot) => {
  container.innerHTML = '';
  const data = snapshot.val();
  if (data) {
    Object.entries(data).forEach(([key, iconData]) => {
      createIconElement(iconData, key);
    });
  }
});

addIconButton.addEventListener('click', () => {
  const iconData = {
    left: 100,
    top: 100,
    url: '',
    text: ''
  };
  const key = db.ref('icons').push().key;
  db.ref('icons/' + key).set(iconData);
});

applyBtn.addEventListener('click', () => {
  if (!currentKey) return;

  const file = imgFileInput.files[0];
  const text = iconTextInput.value.trim();

  db.ref('icons/' + currentKey).update({
    url: url,
    text: text
  });

  popup.classList.add('hidden');
  currentKey = null;
});

closeBtn.addEventListener('click', () => {
  popup.classList.add('hidden');
  currentKey = null;
});

function createIconElement(data, key) {
  const icon = document.createElement('div');
  icon.className = 'icon';
  icon.style.left = data.left + 'px';
  icon.style.top = data.top + 'px';

  if (file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    currentIcon.appendChild(img);
  };
  reader.readAsDataURL(file);
}

  if (data.text) {
    const span = document.createElement('span');
    span.textContent = data.text;
    icon.appendChild(span);
  }

  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    currentKey = key;
    imgUrlInput.value = data.url || '';
    iconTextInput.value = data.text || '';
    popup.classList.remove('hidden');
  });

  makeDraggable(icon, key);
  container.appendChild(icon);
}

function makeDraggable(el, key) {
  let offsetX, offsetY;

  const onMove = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const left = x - offsetX;
    const top = y - offsetY;
    el.style.left = left + 'px';
    el.style.top = top + 'px';
    db.ref('icons/' + key).update({ left, top });
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
