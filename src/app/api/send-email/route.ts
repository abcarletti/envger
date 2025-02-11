import transporter from '@/utils/email-sender'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	const { email, context, template, subject } = await request.json()

	const mailOptions = {
		from: process.env.SITE_MAIL_SENDER,
		to: email,
		subject,
		template, // Nombre de la plantilla
		context,
	}

	const res = NextResponse.json(
		{ message: 'Correo enviado exitosamente' },
		{ status: 200 },
	)

	try {
		await transporter.sendMail(mailOptions)
		return res
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Error al enviar el correo' },
			{ status: 500 },
		)
	}
}
