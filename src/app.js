const { app, PORT, logger } = require("./middlewares/imports.middlewares");

app.listen(PORT, () => {
  try {
    logger.info(`Servidor escuchando en el puerto ${PORT}`);
    logger.info(`Servidor ejecutandose en la URL http://localhost:${PORT}`);
  } catch (err) {
    logger.error("Error interno del servidor", err.message);
  }
});
