const menuHamburger = document.querySelector(".toggle")
const navLinks = document.querySelector(".nav-links")

menuHamburger.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-menu')
})