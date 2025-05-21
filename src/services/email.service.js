import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY no está definida. El servicio de correo no funcionará.');
}

const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

/**
 * Envía un correo electrónico utilizando SendGrid.
 * @param {object} options 
 * @param {string} options.to 
 * @param {string} options.subject 
 * @param {string} options.html 
 * @returns {Promise<void>}
 */
export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
    console.error('Error: SENDGRID_API_KEY o SENDGRID_FROM_EMAIL no están configurados. No se puede enviar el correo.');
    return Promise.reject('Configuración de SendGrid incompleta.');
  }

  const msg = {
    to,
    from: SENDGRID_FROM_EMAIL,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Correo enviado a ${to} con asunto "${subject}"`);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    if (error.response) {
      console.error('Detalles del error de SendGrid:', error.response.body);
    }
    throw error;
  }
};
