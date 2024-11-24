const homeSection = document.querySelector("#home");
const facilitiesContainer = document.getElementById("facilities-container");
const aboutStatesContainer = document.getElementById("about-states-container");
const basicPlanList = document.getElementById("basicPlanList");
const proPlanList = document.getElementById("proPlanList");
const premiumPlanList = document.getElementById("premiumPlanList");

window.addEventListener("scroll", pageScrollFunction);
window.addEventListener("load", pageScrollFunction);

function pageScrollFunction() {
  if (window.scrollY > 150) {
    homeSection.classList.add("active");
  } else {
    homeSection.classList.remove("active");
  }
}

const facilities = [
  {
    icon: "fa-solid fa-dumbbell",
    title: "QUIENES SOMOS",
    desc: "Olympia Alternativa es un equipo de profesionales en educación física, recreación y deporte, comprometidos con el bienestar integral en todas las etapas del ciclo de vida. Ofrecemos una amplia gama de especialidades para que encuentres todo lo que necesitas en un solo lugar.",
  },
  {
    icon: "fa-solid fa-person-running",
    title: "MISIÓN",
    desc: " Trabajar con personas y comunidades prestando servicios profesionales para a lograr objetivos. Ofrecemos planes de trabajo personalizados e individualizados, además de productos de alta calidad para el cuidado de la salud en todas las etapas del ciclo de vida.",
  },
  {
    icon: "fa-solid fa-person-swimming",
    title: "VISIÓN",
    desc: " Consolidarnos como líderes regionales con un equipo de profesionales en educación física, capaces de planificar, dirigir y evaluar proyectos que impacten positivamente. Ofrecemos servicios de alta calidad con la visión de expandirnos y posicionarnos a nivel nacional.",
  },
];

facilities.forEach((facility) => {
  const facilityItem = document.createElement("div");
  facilityItem.classList.add("facility-item");
  facilityItem.innerHTML = `
    <div class="facility-icon">
      <i class="${facility.icon}"></i>
    </div>
    <div class="facility-desc">
      <h2>${facility.title}</h2>
      <p>${facility.desc}</p>
    </div>
  `;
  facilitiesContainer.appendChild(facilityItem);
});
