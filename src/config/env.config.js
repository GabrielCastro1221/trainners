const dotenv = require("dotenv");
const program = require("./commander.config");

const { mode } = program.opts();
dotenv.config({ path: mode === "dev" ? "./.env.dev" : "./.env.build" });

const configObject = {
  server: {
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT || 5000,
    base_url: process.env.BASE_URL,
  },
  auth: {
    jwt_secret: process.env.JWT_SECRET,
    cookie_token: process.env.COOKIE_TOKEN,
  },
  logger: {
    log_level: process.env.LOG_LEVEL,
    log_to_file: process.env.LOG_TO_FILE,
    log_file_name: process.env.LOG_FILE_NAME,
  },
  mailer: {
    mailer_user: process.env.MAILER_USER,
    mailer_pass: process.env.MAILER_PASS,
    email_from: process.env.EMAIL_FROM,
    email_service: process.env.EMAIL_SERVICE,
    base_url_reset_password: process.env.BASE_URL_RESET_PASSWORD,
  },
  cloudinary: {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME,
    cloudinary_url: process.env.CLOUDINARY_URL,
  },
};

module.exports = configObject;
