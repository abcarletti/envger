'use client'

import { useToast } from '@/app/hooks/use-toast'
import { createOrUpdateProject } from '@/app/services/server-actions'
import { AutosizeTextarea } from '@/components/ui/autosize-textarea'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PROJECT_KEY, PROJECTS_SELECTOR_KEY } from '@/lib/constants'
import { getTagByName } from '@/lib/utils'
import { queryClient } from '@/providers/tanstack-query'
import { createProyectSchema } from '@/schemas/project'
import { zodResolver } from '@hookform/resolvers/zod'
import { Project } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ProjectForm = ({
	project,
	dialogOpen,
}: {
	project?: Project
	dialogOpen: (open: boolean) => void
}) => {
	const { setMessage } = useToast()
	const { push } = useRouter()

	const form = useForm<z.infer<typeof createProyectSchema>>({
		resolver: zodResolver(createProyectSchema),
		defaultValues: {
			name: project?.name || '',
			description: project?.description || '',
			slug: project?.slug || '',
		},
	})

	const { reset } = form

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		form.setValue('name', e.target.value)
		form.setValue('slug', getTagByName(e.target.value))
	}

	const invalidateProjectsQuery = () => {
		queryClient.removeQueries({
			queryKey: [PROJECT_KEY, { slug: project?.slug }],
		})
		queryClient.invalidateQueries({
			queryKey: [PROJECTS_SELECTOR_KEY],
		})
	}

	const onSubmit = async (values: z.infer<typeof createProyectSchema>) => {
		try {
			await createOrUpdateProject(values, project?.id)
			setMessage({
				message: `Proyecto ${project ? 'actualizado' : 'creado'} correctamente`,
				type: 'success',
			})
			push(`/dashboard/${values.slug}`)
			invalidateProjectsQuery()
			reset()
			dialogOpen(false)
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes('Unique constraint failed on the fields')
			) {
				form.setError('name', {
					type: 'manual',
					message: 'El nombre del proyecto ya existe',
				})
			} else {
				setMessage({
					message: 'Se ha producido un error al guardar el proyecto',
					type: 'error',
				})
			}
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="flex gap-2">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Nombre</FormLabel>
								<FormControl>
									<Input
										placeholder="Nombre del proyecto"
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
						name="slug"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Path</FormLabel>
								<FormControl>
									<Input {...field} readOnly />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Description</FormLabel>
							<FormControl>
								<AutosizeTextarea {...field} className="bg-transparent" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* <FormField
								control={form.control}
								name="imageUrl"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Logo URL</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/> */}
				<footer className="flex flex-row-reverse mt-4 gap-2">
					<Button type="submit" size={'lg'} className="w-full">
						Guardar
					</Button>
					<Button size={'lg'} variant={'secondary'} className="w-full" asChild>
						<Link href="/dashboard">Cancelar</Link>
					</Button>
				</footer>
			</form>
		</Form>
	)
}

export default ProjectForm
