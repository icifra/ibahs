window.addEventListener('DOMContentLoaded', () => {
  const logoImg = document.querySelector('.h-logo');
  const footerLogoImg = document.querySelector('.footer-logo');

  // Вращение основного логотипа
  if (logoImg.complete) {
    logoImg.classList.add('rotate');
  } else {
    logoImg.addEventListener('load', () => {
      logoImg.classList.add('rotate');
    });
  }

  // Когда анимация основного логотипа завершится, запускаем анимацию футерного логотипа
  logoImg.addEventListener('animationend', () => {
    footerLogoImg.classList.add('rotate-infinite');
  });
});
