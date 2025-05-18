import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Config __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASSWORD
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production"
    }
  });

  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, "../../public/templates", template);

  // Render the email template with EJS
  const html = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

export default { sendMail };
