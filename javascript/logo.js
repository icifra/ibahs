window.addEventListener('DOMContentLoaded', () => {
    const logoImg = document.querySelector('.h-logo');
    if (logoImg.complete) {
        logoImg.classList.add('rotate');
    } else {
        logoImg.addEventListener('load', () => {
            logoImg.classList.add('rotate');
        });
    }
});