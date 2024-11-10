import {
	handleCredentialSignIn,
	handleGitHubSignIn,
} from '@/app/services/server-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export default function RegisterCard({
	loginError,
}: {
	loginError: (msg: string) => void
}) {
	const handleError = (msg: string) => {
		loginError(msg)
	}

	return (
		<Card className="mx-auto min-w-96 h-fit">
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
							<Label htmlFor="name">Nombre completo</Label>
							<Input id="name" name="name" type="text" required />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Contraseña</Label>
							</div>
							<Input id="password" type="password" name="password" required />
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Repetir contraseña</Label>
							</div>
							<Input id="password" type="password" name="password" required />
						</div>
						<Button type="submit" className="w-full">
							Registrarme
						</Button>
					</form>
					<form
						action={async () => {
							await handleGitHubSignIn()
						}}
					>
						<Button type="submit" variant="outline" className="w-full gap-2">
							<GitHubLogoIcon /> Acceder con GitHub
						</Button>
					</form>
				</div>
			</CardContent>
		</Card>
	)
}
