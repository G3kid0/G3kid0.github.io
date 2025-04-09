const addIconButton = document.getElementById('addIcon');
const container = document.getElementById('iconContainer');

addIconButton.addEventListener('click', () => {
  const icon = document.createElement('div');
  icon.className = 'icon';
  icon.style.left = '100px';
  icon.style.top = '100px';
  icon.textContent = '🔵';
  makeDraggable(icon);
  container.appendChild(icon);
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
