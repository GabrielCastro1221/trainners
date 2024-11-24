document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
    const userId = document.getElementById("deleteAccountBtn").getAttribute("data-user-id"); // Obtén el ID del usuario del atributo data
    const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local

    if (confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
        try {
            const response = await fetch(`/api/v1/trainer/${userId}`, {
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
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
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
