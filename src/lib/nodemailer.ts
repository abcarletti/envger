'use server'

import nodemailer from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD
const SITE_MAIL_RECEIVER = process.env.SITE_MAIL_RECEIVER
const SITE_MAIL_SENDER = process.env.SITE_MAIL_SENDER

const transporter = nodemailer.createTransport({
	host: SMTP_SERVER_HOST,
	port: 465,
	secure: true, // true for port 465, false for other ports
	auth: {
		user: SMTP_SERVER_USERNAME,
		pass: SMTP_SERVER_PASSWORD,
	},
})

export async function sendMail({
	sendTo,
	sendCc,
	sendBcc,
	subject,
	text,
	html,
	attachments,
}: {
	sendTo?: string
	sendCc?: string
	sendBcc?: string
	subject: string
	text?: string
	html?: string
	attachments?: Attachment[]
}) {
	try {
		const isVerified = await transporter.verify()
		if (!isVerified) {
			console.error('Something Went Wrong')
			return
		}
	} catch (error) {
		console.error(
			'Something Went Wrong',
			SMTP_SERVER_USERNAME,
			SMTP_SERVER_PASSWORD,
			error,
		)
		return
	}
	const info = await transporter.sendMail({
		from: SITE_MAIL_SENDER,
		to: sendTo || SITE_MAIL_RECEIVER,
		cc: sendCc,
		bcc: sendBcc,
		subject: subject,
		text: text,
		html: html ? html : '',
		attachments: attachments,
	})
	return info
}
