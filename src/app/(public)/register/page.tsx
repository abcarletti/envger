import { RegisterForm } from '@/components/register-page'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
	const session = await auth()

	if (session) {
		redirect('/dashboard')
	}

	return <RegisterForm />
}
