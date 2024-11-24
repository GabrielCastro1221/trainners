const modal = document.getElementById("editProfileModal");
const btn = document.getElementById("editProfileBtn");
const span = document.getElementsByClassName("close")[0];

document
  .getElementById("deleteAccountBtn")
  .addEventListener("click", async () => {
    const userId = document
      .getElementById("deleteAccountBtn")
      .getAttribute("data-user-id");
    const token = localStorage.getItem("token");

    if (
      confirm(
        "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    ) {
      try {
        const response = await fetch(`/api/v1/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.status) {
          Toastify({
            text: "Cuenta eliminada con éxito",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50",
          }).showToast();
          localStorage.removeItem("token");
          window.location.href = "/";
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
        console.error("Error al eliminar la cuenta:", error);
        Toastify({
          text: "Error en el servidor. Intenta nuevamente.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      }
    }
  });

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document
  .getElementById("editProfileForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = btn.getAttribute("data-user-id");
    const token = localStorage.getItem("token");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.status) {
        Toastify({
          text: "Perfil actualizado con éxito",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#4CAF50",
        }).showToast();
        modal.style.display = "none";
        document.querySelector(".userName .name").textContent = data.name;
        document.querySelector(".email .info").textContent = data.email;
        document.querySelector(".phone .info").textContent =
          data.phone || "No disponible";
        document.querySelector(".gender .info").textContent = data.gender;
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
      console.error("Error al actualizar el perfil:", error);
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
