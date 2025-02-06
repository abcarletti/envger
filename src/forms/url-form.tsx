'use client'

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
import { URLS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { environments } from '@/models/environment'
import { queryClient } from '@/providers/tanstack-query'
import { createUrlSchema } from '@/schemas/url'
import { createOrUpdateUrl } from '@/services/url-service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Url } from '@prisma/client'
import { ReactElement, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface UrlFormProps {
	urlDetail?: Url
	groupId: string
	triggerText: ReactElement | string
	className?: string
	title: string
	description?: string
}

const UrlForm = ({
	urlDetail,
	groupId,
	triggerText,
	title,
	className,
	description,
}: UrlFormProps) => {
	const { setMessage } = useToast()
	const [isOpen, setIsOpen] = useState(false)
	const [urlDetailState, setUrlDetailState] = useState<Url | undefined>(
		urlDetail,
	)

	const form = useForm<z.infer<typeof createUrlSchema>>({
		resolver: zodResolver(createUrlSchema),
		defaultValues: {
			url: '',
			environment: '',
		},
	})
	const { reset } = form

	const onSubmit = async (values: z.infer<typeof createUrlSchema>) => {
		try {
			await createOrUpdateUrl(urlDetailState?.id, groupId, values)
			await queryClient.invalidateQueries({
				queryKey: [
					URLS_KEY,
					{
						group: groupId,
					},
				],
			})
			reset()
			setMessage({
				message: urlDetailState ? 'Url actualizada' : 'Url creada',
				type: 'success',
			})
			setIsOpen(false)
		} catch (error) {
			setMessage({
				message: 'Se ha producido un error guardando la url',
				type: 'error',
			})
		}
	}

	useEffect(() => {
		if (urlDetail) {
			setUrlDetailState(urlDetail)
		}
	}, [urlDetail, isOpen])

	useEffect(() => {
		if (!isOpen) {
			reset({
				url: '',
				environment: '',
			})
		} else {
			reset(urlDetailState)
		}
	}, [isOpen])

	return (
		<Dialog
			key={`url-dialog-${urlDetailState?.id}`}
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
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Url</FormLabel>
										<FormControl>
											<Input placeholder="Url" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<footer className="flex flex-row-reverse mt-4 gap-2">
							<Button type="submit" size={'lg'} className="w-full">
								{urlDetail ? 'Actualizar' : 'Guardar'}
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

export default UrlForm
