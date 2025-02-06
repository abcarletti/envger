'use client'

import { GeneratePassword } from '@/components/generate-password'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { CREDENTIALS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { environments } from '@/models/environment'
import { queryClient } from '@/providers/tanstack-query'
import { createCredentialsSchema } from '@/schemas/credentials'
import { createOrUpdateCredentials } from '@/services/credentials-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Credentials } from '@prisma/client'
import { Separator } from '@radix-ui/react-separator'
import { Eye, EyeOff } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface CredentialsFormProps {
	credentialsDetail?: Credentials
	groupId: string
	triggerText: ReactElement | string
	className?: string
	title: string
	description?: string
}

const CredentialsForm = ({
	credentialsDetail,
	groupId,
	triggerText,
	title,
	className,
	description,
}: CredentialsFormProps) => {
	const { setMessage } = useToast()
	const [showPassword, setShowPassword] = useState(!!credentialsDetail)
	const [isOpen, setIsOpen] = useState(false)
	const [credentialDetailState, setCredentialDetailState] = useState<
		Credentials | undefined
	>(credentialsDetail)

	const form = useForm<z.infer<typeof createCredentialsSchema>>({
		resolver: zodResolver(createCredentialsSchema),
		defaultValues: {
			username: '',
			password: '',
			environment: '',
		},
	})
	const { reset } = form

	const onSubmit = async (values: z.infer<typeof createCredentialsSchema>) => {
		try {
			await createOrUpdateCredentials(credentialsDetail?.id, groupId, values)
			await queryClient.invalidateQueries({
				queryKey: [
					CREDENTIALS_KEY,
					{
						group: groupId,
					},
				],
			})
			reset()
			setMessage({
				message: credentialsDetail
					? 'Credenciales actualizadas'
					: 'Credenciales creadas',
				type: 'success',
			})
			setIsOpen(false)
		} catch (error) {
			setMessage({
				message: 'Se ha producido un error guardando las credenciales',
				type: 'error',
			})
		}
	}

	useEffect(() => {
		if (credentialsDetail) {
			setCredentialDetailState(credentialsDetail)
		}
	}, [credentialsDetail, isOpen])

	useEffect(() => {
		if (!isOpen) {
			reset({
				username: '',
				password: '',
				environment: '',
			})
		} else {
			reset(credentialDetailState)
		}
	}, [isOpen])

	return (
		<Dialog
			key={`url-dialog-${credentialDetailState?.id}`}
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<DialogTrigger className={cn(className)}>{triggerText}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
						<div className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name="environment"
								render={({ field }) => (
									<FormItem className="w-full">
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<div className="flex gap-2 items-center">
														<Label className="text-xs text-gray-500">
															Entorno:
														</Label>
														<SelectValue placeholder="Selecciona un entorno" />
													</div>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{environments.map(({ value, label }) => (
													<SelectItem key={value} value={value}>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex gap-2">
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Usuario</FormLabel>
											<FormControl>
												<Input placeholder="Usuario" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormLabel>Contraseña</FormLabel>
											<FormControl>
												<div className="flex items-center">
													<Input
														className="relative"
														type={showPassword ? 'text' : 'password'}
														placeholder="Contraseña"
														{...field}
													/>
													<Button
														variant={'ghost'}
														size={'icon'}
														type="button"
														onClick={() => setShowPassword(!showPassword)}
														className="absolute right-6"
													>
														{showPassword ? (
															<EyeOff className="size-5" />
														) : (
															<Eye className="size-5" />
														)}
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Separator />
							<GeneratePassword
								onUsePassword={(passwordGenerated) => {
									form.setValue('password', passwordGenerated)
								}}
							/>
						</div>
						<footer className="flex flex-row-reverse mt-4 gap-2">
							<Button type="submit" size={'lg'} className="w-full">
								{credentialsDetail ? 'Actualizar' : 'Guardar'}
							</Button>
							<Button
								size={'lg'}
								variant={'secondary'}
								className="w-full"
								onClick={() => setIsOpen(false)}
							>
								Cancelar
							</Button>
						</footer>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default CredentialsForm
