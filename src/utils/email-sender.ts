import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD

// Configura el transportador con tus credenciales
const transporter = nodemailer.createTransport({
	host: SMTP_SERVER_HOST,
	port: 465,
	secure: true, // true for port 465, false for other ports
	auth: {
		user: SMTP_SERVER_USERNAME,
		pass: SMTP_SERVER_PASSWORD,
	},
})

// Opciones de configuración para Handlebars
const handlebarOptions = {
	viewEngine: {
		extName: '.hbs',
		partialsDir: path.resolve('./src/email-templates/'),
		defaultLayout: undefined,
	},
	viewPath: path.resolve('./src/email-templates/'),
	extName: '.hbs',
}

// Adjunta el plugin de Handlebars al transportador
transporter.use('compile', hbs(handlebarOptions))

export default transporter
