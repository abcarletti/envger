import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
	const session = await auth()
	console.log('session', session)

	if (session) {
		redirect('/dashboard')
	} else {
		redirect('/login')
	}
}
