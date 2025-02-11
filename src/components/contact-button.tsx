'use client'

import { contactSchema } from '@/schemas/contact'
import { sendContactEmail } from '@/services/email-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircleCode } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AutoSizeTextarea } from './ui/auto-size-textarea'
import { Button } from './ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export const ContactButton = () => {
	const [open, setOpen] = useState(false)

	const form = useForm<z.infer<typeof contactSchema>>({
		resolver: zodResolver(contactSchema),
		defaultValues: {
			name: '',
			email: '',
			message: '',
		},
	})

	const { reset } = form

	const onSubmit = async (values: z.infer<typeof contactSchema>) => {
		try {
			await sendContactEmail(values)
			setOpen(false)
			reset()
			toast.success('Mensaje enviado correctamente')
		} catch (error) {
			toast.error('Se ha producido un error al enviar el mensaje')
		}
	}

	return (
		<div className="fixed top-4 right-4 z-50">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger>
					<div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
						<MessageCircleCode className="size-6" />
					</div>
				</PopoverTrigger>
				<PopoverContent collisionPadding={16} sideOffset={8}>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8 !min-w-3xl"
						>
							<div className="flex flex-col gap-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nombre</FormLabel>
											<FormControl>
												<Input placeholder="Nombre" {...field} />
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
												<Input type="email" placeholder="Email" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="message"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Mensaje</FormLabel>
											<FormControl>
												<AutoSizeTextarea
													{...field}
													className="bg-transparent"
													placeholder="Mensaje"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<footer className="flex flex-row-reverse mt-4 gap-2">
								<Button type="submit" size={'lg'} className="w-full">
									Enviar
								</Button>
								<Button
									type="button"
									size={'lg'}
									variant={'secondary'}
									className="w-full"
									onClick={() => {
										setOpen(false)
										reset()
									}}
								>
									Cancelar
								</Button>
							</footer>
						</form>
					</Form>
				</PopoverContent>
			</Popover>
		</div>
	)
}
