const titleDateEl = document.querySelector('#title-date');
const now = new Date().toString().slice(0,16);
titleDateEl.innerText = now;