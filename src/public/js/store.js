document.addEventListener("DOMContentLoaded", function () {
  const filterButton = document.getElementById("filter-button");
  const filterMenu = document.getElementById("filter-menu");
  filterButton.addEventListener("click", function (event) {
    event.preventDefault();
    filterMenu.classList.toggle("show");
  });
});
