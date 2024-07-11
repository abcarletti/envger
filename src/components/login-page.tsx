'use client'

import LoginCard from './login-card'
import { toast } from 'sonner'

export function LoginForm() {
	const handleLoginError = (msg: string) => {
		toast.error(msg)
	}

	return (
		<section className="flex items-center h-screen">
			<LoginCard loginError={handleLoginError} />
		</section>
	)
}
