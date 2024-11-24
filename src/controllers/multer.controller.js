class MulterController {
  uploadFile = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: "No se proporcionó ningún archivo",
        });
      }
      res.status(200).json({
        status: true,
        message: "Imagen cargada correctamente",
        file: {
          url: req.file.path,
          public_id: req.file.filename,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error interno del servidor",
        Error: err.message,
      });
    }
  };
}

module.exports = MulterController;
