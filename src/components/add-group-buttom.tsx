'use client'

import { useToast } from '@/app/hooks/use-toast'
import { createGroup } from '@/app/services/server-actions'
import { GROUPS_KEY } from '@/lib/constants'
import { cn, getTagByName } from '@/lib/utils'
import { useProjectStore } from '@/providers/project-store-provider'
import { queryClient } from '@/providers/tanstack-query'
import { createProjectGroupSchema } from '@/schemas/group'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AutosizeTextarea } from './ui/autosize-textarea'
import { Button } from './ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'
import { Input } from './ui/input'

const AddGroupButtom = () => {
	const { setMessage } = useToast()
	const [dialogOpen, setDialogOpen] = useState(false)
	const { slug } = useProjectStore((store) => store)

	const form = useForm<z.infer<typeof createProjectGroupSchema>>({
		resolver: zodResolver(createProjectGroupSchema),
		defaultValues: {
			name: '',
			description: '',
			tag: '',
		},
	})

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		form.setValue('name', e.target.value)
		form.setValue('tag', getTagByName(e.target.value))
	}

	const { reset } = form

	const onSubmit = async (values: z.infer<typeof createProjectGroupSchema>) => {
		try {
			await createGroup(slug, values)
			setMessage({ message: 'Grupo creado correctamente', type: 'success' })

			await queryClient.invalidateQueries({
				queryKey: [...GROUPS_KEY, slug],
			})

			reset()
			setDialogOpen(false)
		} catch (error) {
			console.log(error)
			if (
				error instanceof Error &&
				error.message.includes('Unique constraint failed on the fields')
			) {
				form.setError('name', {
					type: 'manual',
					message: 'El nombre del grupo ya existe',
				})
			} else {
				setMessage({
					message: 'Se ha producido un error al crear el grupo',
					type: 'error',
				})
			}
		}
	}

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button
					size={'sm'}
					className={cn(
						'w-full bg-primary text-primary-foreground',
						slug ? 'block' : 'hidden',
					)}
				>
					Añadir grupo
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Añadir grupo</DialogTitle>
					<DialogDescription>
						Añade un nuevo grupo al proyecto actual
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												placeholder="Nombre del grupo"
												{...field}
												onChange={handleChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Description</FormLabel>
										<FormControl>
											<AutosizeTextarea minHeight={36} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-row-reverse mt-4 gap-2">
							<Button type="submit" size={'lg'} className="w-full">
								Guardar
							</Button>
							<DialogClose asChild>
								<Button
									type="button"
									size={'lg'}
									variant={'secondary'}
									className="w-full"
								>
									Cancelar
								</Button>
							</DialogClose>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default AddGroupButtom
