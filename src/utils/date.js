const date = new Date();

const fechaPost = date.toLocaleString("es-MX", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

module.exports = { fechaPost };
