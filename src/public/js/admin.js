document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = {
    users: document.getElementById("usersSection"),
    trainers: document.getElementById("trainersSection"),
    products: document.getElementById("productsSection"),
    tickets: document.getElementById("ticketsSection"),
    post: document.getElementById("postSection"),
  };

  const showSection = (sectionId) => {
    for (const section in sections) {
      sections[section].style.display = "none";
    }
    sections[sectionId].style.display = "block";
  };

  const activateLink = (clickedLinkId) => {
    navLinks.forEach((link) => link.classList.remove("active"));
    document.getElementById(clickedLinkId).classList.add("active");
  };

  document.getElementById("usersTab").addEventListener("click", (event) => {
    event.preventDefault();
    showSection("users");
    activateLink("usersTab");
  });

  document.getElementById("trainersTab").addEventListener("click", (event) => {
    event.preventDefault();
    showSection("trainers");
    activateLink("trainersTab");
  });

  document.getElementById("productsTab").addEventListener("click", (event) => {
    event.preventDefault();
    showSection("products");
    activateLink("productsTab");
  });

  document.getElementById("ticketsTab").addEventListener("click", (event) => {
    event.preventDefault();
    showSection("tickets");
    activateLink("ticketsTab");
  });

  document.getElementById("postTab").addEventListener("click", (event) => {
    event.preventDefault();
    showSection("post");
    activateLink("postTab");
  });

  showSection("users");
  fetchUsers();
  fetchTrainers();
  fetchProducts();
  fetchTickets();
  fetchPosts();

  document
    .getElementById("createTrainerForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      if (!name || !email || !password) {
        Swal.fire({
          icon: "error",
          title: "Campos incompletos",
          text: "Por favor complete todos los campos.",
        });
        return;
      }
      try {
        const response = await fetch("/api/v1/trainer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (data.status) {
          Swal.fire({
            icon: "success",
            title: "Entrenador creado",
            text: "El entrenador ha sido creado con éxito.",
          });
          document.getElementById("createTrainerForm").reset();
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("exampleModal")
          );
          modal.hide();
          fetchTrainers();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Hubo un problema al crear el entrenador.",
          });
        }
      } catch (error) {
        console.error("Error al crear el entrenador:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al crear el entrenador. Inténtalo más tarde.",
        });
      }
    });
});

async function fetchUsers() {
  try {
    const response = await fetch("/api/v1/users");
    const data = await response.json();
    if (data.status === true) {
      const users = data.usuarios;
      const tableBody = document.getElementById("usersBody");
      tableBody.innerHTML = "";
      users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.phone || "N/A"}</td>
          <td>${user.role}</td>
          <td>${user.gender || "N/A"}</td>
          <td>
            <button class="btn-thrash" title="Eliminar usuario" onclick="deleteUser('${
              user._id
            }')">
              <i class="fa-solid fa-trash-can"></i> 
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      console.error("No se encontraron usuarios");
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
}

async function deleteUser(userId) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás recuperar este usuario después de eliminarlo!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Usuario eliminado!",
          text: "El usuario ha sido eliminado con éxito.",
          confirmButtonColor: "#3085d6",
        });
        fetchUsers();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el usuario.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al intentar eliminar el usuario.",
        confirmButtonColor: "#d33",
      });
    }
  }
}

async function fetchTrainers() {
  try {
    const response = await fetch("/api/v1/trainer");
    if (!response.ok) {
      throw new Error(
        `Error al obtener los entrenadores: ${response.statusText}`
      );
    }
    const data = await response.json();
    if (data.status === true) {
      const trainers = data.entrenadores;
      const tableBody = document.getElementById("trainersBody");
      tableBody.innerHTML = "";
      trainers.forEach((trainer, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td style="min-width: 170px;">${trainer.name}</td>
          <td>${trainer.email}</td>
          <td>${trainer.phone || "N/A"}</td>
          <td>${trainer.isApproved}</td>
          <td>${trainer.specialization || "N/A"}</td>
          <td style="min-width: 110px;">
            <button class="btn-thrash" title="Eliminar entrenador" onclick="deleteTrainer('${
              trainer._id
            }')">
              <i class="fa-solid fa-trash-can"></i> 
            </button>
             <button class="btn-thrash" onclick="changeTrainerStatus('${
               trainer._id
             }', 'approved')"><i class="fa-solid fa-circle-check"></i></button>
            <button class="btn-thrash" onclick="changeTrainerStatus('${
              trainer._id
            }', 'cancelled')"><i class="fa-solid fa-circle-xmark"></i></button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "No se encontraron entrenadores",
        text: "Actualmente no hay entrenadores registrados.",
      });
    }
  } catch (error) {
    console.error("Error al obtener entrenadores:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Hubo un problema al obtener los entrenadores: ${error.message}`,
    });
  }
}

async function deleteTrainer(trainerId) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás recuperar este entrenador después de eliminarlo!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/v1/trainer/${trainerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Entrenador eliminado!",
          text: "El entrenador ha sido eliminado con éxito.",
          confirmButtonColor: "#3085d6",
        });
        fetchTrainers();
      } else {
        throw new Error("No se pudo eliminar el entrenador");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Hubo un problema al intentar eliminar el entrenador: ${error.message}`,
        confirmButtonColor: "#d33",
      });
    }
  }
}

async function changeTrainerStatus(trainerId, newStatus) {
  try {
    const response = await fetch(`/api/v1/trainer/${trainerId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    if (data.status) {
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `El estado del entrenador ha sido actualizado a "${newStatus}".`,
      });
      fetchTrainers();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "No se pudo actualizar el estado.",
      });
    }
  } catch (error) {
    console.error("Error al cambiar el estado del entrenador:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Error al cambiar el estado: ${error.message}`,
    });
  }
}

let products = [];

const fetchProducts = async () => {
  try {
    const response = await fetch("/api/v1/products/prods");
    if (response.ok) {
      const data = await response.json();
      if (data.status && data.productos) {
        products = data.productos;
        const productsBody = document.getElementById("productsBody");
        productsBody.innerHTML = "";

        products.forEach((product) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.status ? "Activo" : "Inactivo"}</td>
            <td style="min-width: 170px;">
              <button class="btn-thrash" data-bs-toggle="modal" data-bs-target="#updateModal" onclick="fillProductModal('${
                product._id
              }')">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button class="btn-thrash" onclick="deleteProduct('${
                product._id
              }')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          `;
          productsBody.appendChild(row);
        });
      } else {
        console.error(
          "No se encontraron productos o no se obtuvo la respuesta esperada."
        );
      }
    } else {
      console.error(
        "Error al obtener los productos:",
        response.status,
        response.statusText
      );
    }
  } catch (err) {
    console.error("Error al hacer la solicitud:", err);
  }
};

function fillProductModal(productId) {
  const product = products.find((p) => p._id === productId);
  if (product) {
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    const price = document.getElementById("price");
    const stock = document.getElementById("stock");
    const category = document.getElementById("category");
    const status = document.getElementById("status");
    const productIdField = document.getElementById("productId");
    if (title && description && price && stock && category && productIdField) {
      title.value = product.title;
      description.value = product.description;
      price.value = product.price;
      stock.value = product.stock;
      category.value = product.category;
      productIdField.value = product._id;
      status.value = product.status ? "true" : "false";
    } else {
      console.error("No se encontraron los elementos del formulario.");
    }
  } else {
    console.error("No se encontró el producto con el ID:", productId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const createProductForm = document.getElementById("createProductForm");

  createProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(createProductForm);

    try {
      const response = await fetch("/api/v1/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status) {
        Swal.fire({
          icon: "success",
          title: "Producto creado",
          text: data.message,
        });
        createProductForm.reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Hubo un problema al crear el producto.",
        });
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al crear el producto. Inténtalo más tarde.",
      });
    }
  });
});

const deleteProduct = async (id) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás recuperar este producto después de eliminarlo!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  if (result.isConfirmed) {
    try {
      const response = await fetch(`/api/v1/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          Swal.fire({
            icon: "success",
            title: "Producto eliminado",
            text: data.message,
          });
          fetchProducts();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Hubo un problema al eliminar el producto.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al eliminar el producto.",
        });
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al intentar eliminar el producto.",
      });
    }
  }
};

async function updateProduct(event) {
  event.preventDefault();
  const form = event.target;
  const updatedProduct = {
    title: form.title.value,
    description: form.description.value,
    price: parseFloat(form.price.value),
    stock: parseInt(form.stock.value),
    category: form.category.value,
    _id: form.productId.value,
  };
  try {
    const response = await fetch(`/api/v1/products/${updatedProduct._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status) {
        Toastify({
          text: "Producto actualizado con éxito",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          className: "info",
          duration: 3000,
        }).showToast();
      }
    }
  } catch (err) {
    console.error("Error al actualizar el producto:", err);
    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: "Ocurrió un error al actualizar el producto. Por favor, intenta más tarde.",
    });
  }
}

function closeModal() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("updateModal")
  );
  modal.hide();
}
async function fetchTickets() {
  try {
    const response = await fetch("/api/v1/tickets");
    if (!response.ok) {
      throw new Error("Error al cargar los tickets");
    }

    const data = await response.json();
    if (data.status && data.tickets) {
      const tickets = data.tickets;
      const ticketsBody = document.getElementById("ticketsBody");
      ticketsBody.innerHTML = ""; // Limpiar los tickets anteriores

      tickets.forEach((ticket, index) => {
        const ticketRow = document.createElement("tr");
        ticketRow.innerHTML = `
          <td>${ticket.code}</td>
          <td>${ticket.amount}</td>
          <td>${ticket.purchaser.name || "N/A"}</td>
          <td>${new Date(ticket.purchase_datetime).toLocaleString()}</td>
          <td>${ticket.isPaid}</td>
          <td style="min-width: 200px;">
            <button class="btn-thrash" title="ticket pagado" onclick="changePaymentStatus('${
              ticket._id
            }', 'pago')">
              <i class="fa-solid fa-circle-check"></i>
            </button>
            <button class="btn-thrash" title="Ticket pendiente" onclick="changePaymentStatus('${
              ticket._id
            }', 'pendiente')">
              <i class="fa-solid fa-circle-xmark"></i>
            </button>
            <button class="btn-thrash" title="ticket cancelado" onclick="changePaymentStatus('${
              ticket._id
            }', 'cancelado')">
              <i class="fa-solid fa-ban"></i>
            </button>
            <button class="btn-thrash" title="Eliminar ticket" onclick="deleteTicket('${
              ticket._id
            }')"><i class="fa-solid fa-trash-can"></i></button>
          </td>
        `;
        ticketsBody.appendChild(ticketRow);
      });
    } else {
      throw new Error("No se encontraron tickets");
    }
  } catch (error) {
    console.error("Error al cargar los tickets:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al cargar los tickets.",
    });
  }
}

window.onload = fetchTickets;

async function changePaymentStatus(ticketId, newStatus) {
  try {
    const response = await fetch(`/api/v1/tickets/${ticketId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isPaid: newStatus,
      }),
    });
    if (!response.ok) {
      throw new Error("Error al cambiar el estado de pago");
    }
    const data = await response.json();
    if (data.status) {
      Swal.fire("Éxito", "El estado de pago ha sido actualizado", "success");
      fetchTickets();
    } else {
      Swal.fire(
        "Error",
        data.message || "No se pudo actualizar el estado de pago",
        "error"
      );
    }
  } catch (error) {
    console.error("Error al actualizar el estado de pago:", error);
    Swal.fire(
      "Error",
      "Hubo un problema al cambiar el estado de pago",
      "error"
    );
  }
}

async function deleteTicket(ticketId) {
  const confirmDelete = await Swal.fire({
    icon: "warning",
    title: "¿Estás seguro?",
    text: "¡Este ticket será eliminado permanentemente!",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (confirmDelete.isConfirmed) {
    try {
      const response = await fetch(`/api/v1/tickets/${ticketId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("No se pudo eliminar el ticket");
      }
      const data = await response.json();
      if (data.status) {
        Swal.fire("Eliminado", "El ticket ha sido eliminado", "success");
        fetchTickets();
      } else {
        Swal.fire(
          "Error",
          data.message || "No se pudo eliminar el ticket",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al eliminar el ticket:", error);
      Swal.fire("Error", "Hubo un problema al eliminar el ticket", "error");
    }
  }
}

document.getElementById("savePostBtn").addEventListener("click", async () => {
  const form = document.getElementById("postForm");
  const formData = new FormData(form);
  try {
    const response = await fetch("/api/v1/post", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result.status) {
      Toastify({
        text: "Publicación creada con éxito",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
    } else {
      Toastify({
        text: `Error: ${result.message}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  } catch (error) {
    console.error("Error en la creación de la publicación:", error);
    Toastify({
      text: "Error en el servidor. Intenta nuevamente.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
  }
});

async function fetchPosts() {
  try {
    const response = await fetch("/api/v1/post");
    const result = await response.json();
    if (result.status) {
      result.publicaciones.forEach((post) => addPostToTable(post));
    } else {
      Toastify({
        text: `Error: ${result.message}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    Toastify({
      text: "Error en el servidor. Intenta nuevamente.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
  }
}

function addPostToTable(post) {
  const tableBody = document.getElementById("postsTableBody");
  const row = document.createElement("tr");
  row.innerHTML = ` 
        <td>${post.category}</td>
        <td>${post.post_date}</td>
        <td>${post.title_one}</td>
        <td>${post.desc_one}</td>
        <td>${post.title_two || ""}</td>
        <td>${post.desc_two || ""}</td>  
        <td> 
          <button class="btn-thrash del" data-id="${post._id}">
            <i class="fa-solid fa-trash-can"></i>
          </button> 
        </td>`;

  tableBody.appendChild(row);

  const deleteButton = row.querySelector(".del");
  deleteButton.addEventListener("click", () => handleDeletePost(post._id));
}

async function handleDeletePost(postId) {
  const confirmDelete = confirm(
    "¿Estás seguro de que deseas eliminar esta publicación?"
  );
  if (!confirmDelete) return;
  try {
    const response = await fetch(`/api/v1/post/${postId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (response.ok) {
      Toastify({
        text: "Publicación eliminada con éxito",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      document
        .querySelector(`button[data-id="${postId}"]`)
        .closest("tr")
        .remove();
    } else {
      Toastify({
        text: result.message || "No se pudo eliminar la publicación",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  } catch (error) {
    console.error("Error al intentar eliminar la publicación:", error);
    Toastify({
      text: "Error al intentar eliminar la publicación",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
  }
}

async function fillEditModal(postId) {
  try {
    const response = await fetch(`/api/v1/post/${postId}`);
    const result = await response.json();
    if (result.status) {
      const post = result.publicacion;
      const form = document.getElementById("editForm");
      form.dataset.postId = post._id;
      form.editCategory.value = post.category;
      form.editTitleOne.value = post.title_one;
      form.editDescOne.value = post.desc_one;
      form.editTitleTwo.value = post.title_two || "";
      form.editDescTwo.value = post.desc_two || "";
    } else {
      Toastify({
        text: `Error: ${result.message}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  } catch (error) {
    console.error("Error al cargar los datos de la publicación:", error);
    Toastify({
      text: "Error al cargar los datos de la publicación.",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
  }
}

