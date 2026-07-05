import { Resend } from "resend";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Config __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendMail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { email, subject, template, data } = options;

  const templatePath = path.join(__dirname, "../../public/templates", template);

  // Render the email template with EJS
  const html = await ejs.renderFile(templatePath, data);

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html
  });

  if (error) {
    throw new Error(error.message || "Failed to send email via Resend");
  }
};

const checkConnection = async () => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.apiKeys.list();

  if (error) {
    throw new Error(error.message || "Failed to reach Resend API");
  }
};

export default { sendMail, checkConnection };
