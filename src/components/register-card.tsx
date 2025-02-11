'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { registerSchema } from '@/schemas/register'
import { sendRegisterEmail } from '@/services/email-service'
import { handleGitHubSignIn } from '@/services/server-actions'
import { createUser } from '@/services/user-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'

export default function RegisterCard({
	loginError,
}: {
	loginError: (msg: string) => void
}) {
	const { setMessage } = useToast()
	const { push } = useRouter()
	const handleError = (msg: string) => {
		loginError(msg)
	}

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	const { reset } = form

	const onSubmit = async (values: z.infer<typeof registerSchema>) => {
		if (values.password !== values.confirmPassword) {
			handleError('Las contraseñas no coinciden')
			return
		}

		try {
			await createUser(values)
			reset()
			setMessage({
				message: 'Usuario creado correctamente',
				type: 'success',
			})
			push('/login')
			await sendRegisterEmail(values)
		} catch (error) {
			handleError(
				'Se ha producido un error al crear el usuario. Inténtelo con otro email.',
			)
		}
	}

	return (
		<Card className="mx-auto min-w-96 h-fit mb-5">
			<CardContent className="pt-6">
				<div className="grid gap-4">
					<Form {...form}>
						<form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre completo</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="john.doe@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contraseña</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="********"
												maxLength={40}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Repetir contraseña</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="********"
												maxLength={40}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Registrarme
							</Button>
						</form>
					</Form>
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
				<div className="mt-4 text-center text-xs">
					¿Ya tienes una cuenta?{' '}
					<Link href={'/login'} className="underline text-primary">
						Iniciar sesión
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
