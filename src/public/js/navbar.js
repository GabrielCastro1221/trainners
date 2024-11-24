let menubar = document.querySelector("#menu-bars");
let navbar = document.querySelector(".navbar");
const navbarLinks = document.getElementById("navbar");
const loginButton = document.querySelector(".nav-btn");

let navLinks = [
  { path: "/", display: "Inicio" },
  { path: "/entrenadores", display: "Entrenadores" },
  { path: "/tienda", display: "Tienda" },
  { path: "/contacto", display: "Contáctanos" },
  { path: "/blog", display: "Blog" },
];

menubar.onclick = () => {
  menubar.classList.toggle("fa-times");
  navbar.classList.toggle("active");
};

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  loginButton.style.display = "none";
  let profilePath = "/perfil-usuario";

  if (user.role === "entrenador") {
    profilePath = "/perfil-entrenador";
    navLinks = navLinks.filter(
      (link) => link.path !== "/tienda" && link.path !== "/blog"
    );
  } else if (user.role === "admin") {
    profilePath = "/admin";
    navLinks.length = 0;
  }

  navLinks.forEach((link) => {
    const navLink = document.createElement("a");
    navLink.href = link.path;
    navLink.textContent = link.display;
    navbarLinks.appendChild(navLink);
  });

  const userMenu = document.createElement("div");
  userMenu.className = "user-menu";
  userMenu.innerHTML = `
    <span>${user.name}</span>
    <ul class="dropdown">
      <li><a href="${profilePath}">Mi Perfil</a></li>
      <li><a href="/logout" id="logout-btn">Cerrar sesión</a></li>
    </ul>
  `;

  document.querySelector(".right-icons").appendChild(userMenu);

  document.getElementById("logout-btn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  });
} else {
  navLinks.forEach((link) => {
    const navLink = document.createElement("a");
    navLink.href = link.path;
    navLink.textContent = link.display;
    navbarLinks.appendChild(navLink);
  });
}
