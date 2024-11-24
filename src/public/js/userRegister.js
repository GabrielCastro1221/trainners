document
  .getElementById("userRegisterForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.status) {
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

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status) {
        Toastify({
          text: "Inicio de sesión exitoso",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.usuario));
        if (result.role === "usuario") {
          window.location.href = "/perfil-usuario";
        } else if (result.role === "entrenador") {
          window.location.href = "/perfil-entrenador";
        } else if (result.role === "admin") {
          window.location.href = "/admin";
        } else {
          Toastify({
            text: "Rol desconocido, contacta al soporte.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#FF0000",
          }).showToast();
        }
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
      console.error("Error en el inicio de sesión:", error);
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

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const navbar = document.querySelector(".header");
    const userName = document.createElement("span");
    userName.textContent = `Bienvenido, ${user.name}`;
    navbar.appendChild(userName);
  }
});

function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById("imagePreview");
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}
