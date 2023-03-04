window.addEventListener('DOMContentLoaded', () => {
  const logoImg = document.querySelector('.h-logo img');
  if (logoImg.complete) {
    logoImg.classList.add('rotate');
  } else {
    logoImg.addEventListener('load', () => {
      logoImg.classList.add('rotate');
    });
  }
});

// window.addEventListener('load', () => {
//   const logo = document.querySelector('.h-logo img');
//   logo.classList.add('rotate');
// });
