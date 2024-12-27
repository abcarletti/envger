import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	handleCredentialSignIn,
	handleGitHubSignIn,
} from '@/services/server-actions'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export default function LoginCard({
	loginError,
}: {
	loginError: (msg: string) => void
}) {
	const handleError = (msg: string) => {
		loginError(msg)
	}

	return (
		<Card className="mx-auto max-w-sm h-fit">
			<CardContent className="pt-6">
				<div className="grid gap-4">
					<form
						className="grid gap-6"
						action={async (formData) => {
							try {
								await handleCredentialSignIn(formData)
							} catch (error) {
								handleError('Credenciales incorrectas')
							}
						}}
					>
						<div className="grid gap-2">
							<Label htmlFor="username">Usuario</Label>
							<Input
								id="username"
								name="username"
								type="text"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Contraseña</Label>
								<Link
									href="#"
									className="ml-auto inline-block text-xs underline"
								>
									¿Has olvidado tu contraseña?
								</Link>
							</div>
							<Input id="password" type="password" name="password" required />
						</div>
						<Button type="submit" className="w-full">
							Iniciar sesión
						</Button>
					</form>
					<form
						action={async () => {
							try {
								await handleGitHubSignIn()
							} catch (error) {
								loginError(
									'Se ha producido un error al iniciar sesión. Pruebe con otra cuenta',
								)
							}
						}}
					>
						<Button type="submit" variant="outline" className="w-full gap-2">
							<GitHubLogoIcon /> Acceder con GitHub
						</Button>
					</form>
				</div>
				<div className="mt-4 text-center text-sm">
					¿Todavía no tienes una cuenta?{' '}
					<Link href={'/register'} className="underline text-primary">
						Registrarme
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
