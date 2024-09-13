import { signOut } from '@/lib/auth'
import { Button } from './ui/button'

export function SignOut() {
	return (
		<form
			action={async () => {
				'use server'
				await signOut({
					redirectTo: '/login',
				})
			}}
		>
			<Button
				type="submit"
				size={'sm'}
				className="w-full text-sm font-semibold my-1"
			>
				Cerrar sesión
			</Button>
		</form>
	)
}
