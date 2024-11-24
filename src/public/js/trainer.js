function generateCards(containerId, data, cardType) {
  const container = document.getElementById(containerId);
  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    let cardContent = "";
    if (cardType === "service") {
      cardContent = `
          <h3>${item.title}</h3>
          <p><strong>Duración:</strong> ${item.duration}</p>
          <p><strong>Descripción:</strong> ${item.description}</p>
        `;
    } else if (cardType === "education") {
      cardContent = `
          <h3>${item.title}</h3>
          <p><strong>${item.institution}</strong></p>
          <p><span class="year">${item.year}</span></p>
        `;
    } else if (cardType === "experience") {
      cardContent = `
          <h3>${item.title}</h3>
          <p><strong>${item.company}</strong></p>
          <p><span class="year">${item.year}</span></p>
          <p>${item.description}</p>
        `;
    }
    card.innerHTML = cardContent;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  generateCards("service-card", services, "service");
  generateCards("education-card", educationData, "education");
  generateCards("card-exp", experiences, "experience");
});
