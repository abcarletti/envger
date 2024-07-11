import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/auth'
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export function LoginForm() {
	return (
		<section className="flex items-center h-screen">
			<Card className="mx-auto max-w-sm h-fit">
				<CardHeader>
					<CardTitle className="text-2xl">Iniciar sesión</CardTitle>
					<CardDescription>
						Ingrese su nombre de usuario a continuación para iniciar sesión en
						su cuenta
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<form
							className="grid gap-4"
							action={async (formData) => {
								'use server'
								try {
									await signIn('credentials', formData, {
										redirectTo: '/dashboard',
									})
								} catch (error) {
									console.error(error)
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
										className="ml-auto inline-block text-sm underline"
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
								'use server'
								await signIn('github', {
									redirectTo: '/dashboard',
								})
							}}
						>
							<Button type="submit" variant="outline" className="w-full gap-2">
								<GitHubLogoIcon /> Iniciar sesión con GitHub
							</Button>
						</form>
					</div>
					<div className="mt-4 text-center text-sm">
						¿Todavía no tienes una cuenta?{' '}
						<Link href="#" className="underline">
							Registrarme
						</Link>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}
