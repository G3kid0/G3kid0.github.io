body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.background {
  width: 100%;
  height: 100%;
  background-image: url('https://picsum.photos/800/600');
  background-size: cover;
  position: relative;
}

#addIcon {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 24px;
  padding: 10px;
  z-index: 10;
}

.icon {
  width: 40px;
  height: 40px;
  background-color: rgba(255,255,255,0.9);
  border: 2px solid black;
  border-radius: 50%;
  position: absolute;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}
