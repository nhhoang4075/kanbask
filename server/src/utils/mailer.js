import nodemailer from 'nodemailer';
import 'dotenv/config';

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production' 
    }
});

// Hàm gửi email cơ bản
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM, 
      to: to,
      subject: subject,
      text: text,
      html: html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`); 
  }
};

// Gửi email xác thực
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  const subject = 'Xác thực địa chỉ Email của bạn';
  const text = `Vui lòng nhấp vào liên kết sau để hoàn tất đăng ký:\n${verificationUrl}\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này.\n\nTrân trọng,\nĐội ngũ Kanbask`; 
  const html = `<p>Vui lòng nhấp vào liên kết sau để hoàn tất đăng ký:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p><p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p><p>Trân trọng,<br/>Đội ngũ Kanbask</p>`;

  try {
      await sendEmail(email, subject, text, html);
      console.log(`Verification email sent to ${email}`);
  } catch (error) {
      console.error(`Failed to send verification email to ${email}:`, error);
      throw error; 
  }
};

// Gửi email đặt lại mật khẩu
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const subject = 'Yêu cầu đặt lại mật khẩu';
  const text = `Nhấp vào liên kết sau để đặt lại mật khẩu:\n${resetUrl}\n\nLiên kết này sẽ hết hạn sau 5 phút.\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này.\n\nTrân trọng,\nĐội ngũ Kanbask`;
  const html = `<p>Nhấp vào liên kết sau để đặt lại mật khẩu:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Liên kết này sẽ hết hạn sau 5 phút.</p><p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p><p>Trân trọng,<br/>Đội ngũ Kanbask</p>`;

  try {
      await sendEmail(email, subject, text, html);
      console.log(`Password reset email sent to ${email}`);
  } catch (error) {
      console.error(`Failed to send password reset email to ${email}:`, error);
      throw error; 
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
};