let educationCount = 1;
let experienceCount = 1;
let serviceCount = 1;

function addEducationField() {
  const container = document.getElementById("educationsFields");
  const div = document.createElement("div");
  div.innerHTML = `
                <input type="text" name="educations[${educationCount}][title]" placeholder="Título" required>
                <input type="text" name="educations[${educationCount}][institution]" placeholder="Institución" required>
            `;
  container.insertBefore(div, container.lastElementChild);
  educationCount++;
}

function addExperienceField() {
  const container = document.getElementById("experiencesFields");
  const div = document.createElement("div");
  div.innerHTML = `
                <input type="text" name="experiences[${experienceCount}][title]" placeholder="Título" required>
                <input type="text" name="experiences[${experienceCount}][company]" placeholder="Compañía" required>
            `;
  container.insertBefore(div, container.lastElementChild);
  experienceCount++;
}

function addServiceField() {
  const container = document.getElementById("servicesFields");
  const div = document.createElement("div");
  div.innerHTML = `
                <input type="text" name="services[${serviceCount}][title]" placeholder="Título" required>
                <input type="text" name="services[${serviceCount}][service]" placeholder="Servicio" required>
            `;
  container.insertBefore(div, container.lastElementChild);
  serviceCount++;
}

document
  .getElementById("trainerRegisterForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const educations = [];
    const experiences = [];
    const services = [];

    document
      .querySelectorAll("#educationsFields div")
      .forEach((field, index) => {
        const title = field.querySelector(
          `input[name="educations[${index}][title]"]`
        )?.value;
        const institution = field.querySelector(
          `input[name="educations[${index}][institution]"]`
        )?.value;
        if (title && institution) {
          educations.push({ title, institution });
        }
      });

    document
      .querySelectorAll("#experiencesFields div")
      .forEach((field, index) => {
        const title = field.querySelector(
          `input[name="experiences[${index}][title]"]`
        )?.value;
        const company = field.querySelector(
          `input[name="experiences[${index}][company]"]`
        )?.value;
        if (title && company) {
          experiences.push({ title, company });
        }
      });

    document.querySelectorAll("#servicesFields div").forEach((field, index) => {
      const title = field.querySelector(
        `input[name="services[${index}][title]"]`
      )?.value;
      const service = field.querySelector(
        `input[name="services[${index}][service]"]`
      )?.value;
      if (title && service) {
        services.push({ title, service });
      }
    });

    formData.append("educations", JSON.stringify(educations));
    formData.append("experiences", JSON.stringify(experiences));
    formData.append("services", JSON.stringify(services));

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status) {
        Toastify({
          text: "Registro exitoso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();

        window.location.href = "/login";
      } else {
        Toastify({
          text: "Error: " + result.message,
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      Toastify({
        text: "Error en el servidor. Intenta nuevamente.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
    }
  });
