const footerSocialMedia = document.getElementById("footer-social-media");
const footerColDesc = document.getElementById('footer-col-desc');

const socialLinks = [
  {
    icon: "fa-brands fa-twitter",
    path: "#",
  },
  {
    icon: "fa-brands fa-instagram",
    path: "#",
  },
  {
    icon: "fa-brands fa-linkedin-in",
    path: "#",
  },
];

socialLinks.forEach((link) => {
  const socialLink = document.createElement("a");
  socialLink.href = link.path;
  socialLink.innerHTML = `<i class="${link.icon}"></i>`;
  footerSocialMedia.appendChild(socialLink);
});

const quickLinks = [
  {
    path: "/",
    display: "Inicio",
  },
  {
    path: "/entrenadores",
    display: "Entrenadores",
  },
  {
    path: "/tienda",
    display: "Tienda",
  },
  {
    path: "/blog",
    display: "Blog",
  },
  {
    path: "/contacto",
    display: "Contactanos",
  },
];

quickLinks.forEach(link => {
  const quickLink = document.createElement('a');
  quickLink.href = link.path;
  quickLink.textContent = link.display;

  footerColDesc.appendChild(quickLink);
});
