const form = document.querySelector("form");
const btn = document.getElementById("button");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm(form)) return;

  sendEmail();
});

const validateForm = (form) => {
  let valid = true;
  let name = form.querySelector(".name");
  let message = form.querySelector(".message");
  let email = form.querySelector(".email");

  valid &= checkField(name, "Por favor ingrese el nombre");
  valid &= checkField(message, "Por favor ingrese el mensaje");
  valid &= checkField(email, "Por favor ingrese el email");

  return Boolean(valid);
};

const checkField = (field, errorMessage) => {
  if (field.value.trim() === "") {
    giveError(field, errorMessage);
    return false;
  }
  removeError(field);
  return true;
};

const giveError = (field, message) => {
  const parentElement = field.parentElement;
  parentElement.classList.add("error");

  let existingError = parentElement.querySelector(".err-msg");
  if (existingError) existingError.remove();

  const error = document.createElement("span");
  error.textContent = message;
  error.classList.add("err-msg");
  parentElement.appendChild(error);
};

const removeError = (field) => {
  const parentElement = field.parentElement;
  parentElement.classList.remove("error");

  let existingError = parentElement.querySelector(".err-msg");
  if (existingError) existingError.remove();
};

const sendEmail = () => {
  btn.value = "Enviando mensaje...";

  const serviceID = "default_service";
  const templateID = "template_m3qcjw4";

  emailjs.sendForm(serviceID, templateID, form).then(
    () => {
      btn.value = "Enviar";
      Toastify({
        text: "Mensaje enviado con éxito!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();
    },
    (err) => {
      btn.value = "Enviar";
      Toastify({
        text: `Error: ${JSON.stringify(err)}`,
        duration: 5000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
    }
  );
};
