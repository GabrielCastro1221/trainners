function deleteProdFromUser(cartId, productId) {
  fetch(`/api/v1/cart/${cartId}/product/${productId}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al eliminar el producto del carrito");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function emptyUserCart(cartId) {
  fetch(`/api/v1/cart/${cartId}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al vaciar el carrito");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
