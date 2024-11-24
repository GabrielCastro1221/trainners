document.addEventListener("DOMContentLoaded", () => {
  const filterItems = document.querySelectorAll(".filter-item");
  const postCards = document.getElementById("post-cards");
  const modal = document.getElementById("comment-modal");
  const closeModal = document.getElementById("close-modal");
  const submitCommentButton = document.getElementById("submit-comment");
  const commentTextarea = document.getElementById("new-comment");

  let currentPostId = null;

  const showModal = (comments, postId) => {
    currentPostId = postId;
    const commentList = document.getElementById("comment-list");
    commentList.innerHTML = comments
      .map((comment) => `<li class="comment">${comment.comment}</li>`)
      .join("");

    modal.classList.remove("hidden");
    modal.style.display = "block";
  };

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    currentPostId = null;
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      currentPostId = null;
    }
  });

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/v1/post");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.status && data.publicaciones) {
        renderArticles(data.publicaciones);
      } else {
        postCards.innerHTML = `<p>No se encontraron publicaciones</p>`;
      }
    } catch (error) {
      postCards.innerHTML = `<p>Error al cargar las publicaciones</p>`;
    }
  };

  const renderArticles = (articles) => {
    postCards.innerHTML = articles
      .map(
        (article) => `
        <div class="article-card ${article.category.toLowerCase()}">
          <img src="${article.img}" alt="${article.title_one}" />
          <div class="category">
            <div class="subject ${article.category}"><h3>${
          article.category
        }</h3></div>
            <span>${article.post_date}</span>
          </div>
          <h2 class="article-title">${article.title_one}</h2>
          <p class="article-desc">${article.desc_one}</p>
          <div class="article-views">
            <span class="comment-icon" data-post-id="${
              article._id
            }" data-comments='${JSON.stringify(article.review)}'>${
          article.review.length
        } <i class="fa-solid fa-comment"></i></span>
          </div>
          <button class="view-post-button" onclick="location.href='/post/${
            article._id
          }'">Ver publicación</button>
        </div>
      `
      )
      .join("");

    const commentIcons = document.querySelectorAll(".comment-icon");
    commentIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        const comments = JSON.parse(icon.dataset.comments);
        const postId = icon.dataset.postId;
        showModal(comments, postId);
      });
    });
  };

  const submitComment = async () => {
    const comment = commentTextarea.value.trim();
    if (!comment) {
      Toastify({
        text: "El comentario no puede estar vacío.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff0000",
      }).showToast();
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Toastify({
          text: "Usuario no autenticado.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff0000",
        }).showToast();
        return;
      }

      const response = await fetch(`/api/v1/post/comment/${currentPostId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });
      const data = await response.json();
      if (response.ok) {
        const commentList = document.getElementById("comment-list");
        commentList.innerHTML += `<li class="comment">${comment}</li>`;
        commentTextarea.value = "";
        Toastify({
          text: data.message,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#00b09b",
        }).showToast();
        setTimeout(() => {
          location.reload();
        }, 500);
      } else {
        Toastify({
          text: data.message || "Error al agregar el comentario.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff0000",
        }).showToast();
      }
    } catch (error) {
      Toastify({
        text: "Error al enviar el comentario.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff0000",
      }).showToast();
      console.error("Error en submitComment:", error);
    }
  };

  submitCommentButton.addEventListener("click", submitComment);

  fetchArticles();

  filterItems.forEach((item) => {
    item.addEventListener("click", () => {
      filterItems.forEach((filter) => filter.classList.remove("active-filter"));
      item.classList.add("active-filter");
      const filterValue = item.getAttribute("data-filter");
      const cards = document.querySelectorAll(".article-card");
      cards.forEach((card) => {
        if (filterValue === "all" || card.classList.contains(filterValue)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
