import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de que las variables de entorno se carguen

// Configura SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY no está definida. El servicio de correo no funcionará.');
}

const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

/**
 * Envía un correo electrónico utilizando SendGrid.
 * @param {object} options - Opciones del correo.
 * @param {string} options.to - Dirección de correo del destinatario.
 * @param {string} options.subject - Asunto del correo.
 * @param {string} options.html - Contenido HTML del correo.
 * @returns {Promise<void>}
 */
export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
    console.error('Error: SENDGRID_API_KEY o SENDGRID_FROM_EMAIL no están configurados. No se puede enviar el correo.');
    return Promise.reject('Configuración de SendGrid incompleta.');
  }

  const msg = {
    to,
    from: SENDGRID_FROM_EMAIL, // Usa la dirección de correo verificada en SendGrid
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
