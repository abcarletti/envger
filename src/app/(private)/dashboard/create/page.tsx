'use client'

import { createProject } from '@/app/services/server-actions'
import { AutosizeTextarea } from '@/components/ui/autosize-textarea'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PROJECTS_SELECTOR_KEY } from '@/lib/constants'
import { getSlugByName } from '@/lib/utils'
import { queryClient } from '@/providers/tanstack-query'
import { createProyectSchema } from '@/schemas/project'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export default function CreateDashboardPage() {
	const { push } = useRouter()
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		form.setValue('name', e.target.value)
		form.setValue('slug', getSlugByName(e.target.value))
	}

	const form = useForm<z.infer<typeof createProyectSchema>>({
		resolver: zodResolver(createProyectSchema),
		defaultValues: {
			name: '',
			slug: '',
			description: '',
			imageUrl: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof createProyectSchema>) => {
		try {
			await createProject(values)
			await queryClient.invalidateQueries({
				queryKey: [PROJECTS_SELECTOR_KEY],
			})
			push(`/dashboard/${values.slug}`)
			toast.success('Proyecto creado correctamente')
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes('Unique constraint failed on the fields')
			) {
				form.setError('name', {
					type: 'manual',
					message: 'El nombre del grupo ya existe',
				})
			} else {
				toast.error('Se ha producido un error al crear el proyecto')
			}
		}
	}

	return (
		<section className="flex flex-1 items-center justify-center">
			<Card className="w-10/12 md:w-11/12 lg:w-9/12 xl:w-7/12">
				<CardHeader className="flex items-center">
					<CardTitle>Crear nuevo proyecto</CardTitle>
					<CardDescription className="justify-center py-2">
						Crea un nuevo proyecto para poder almacenar toda las credenciales e
						información relacionada
					</CardDescription>
				</CardHeader>
				<CardContent>
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
											<AutosizeTextarea
												minHeight={36}
												{...field}
												className="bg-transparent"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
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
							/>
							<div className="flex flex-row-reverse mt-4 gap-2">
								<Button type="submit" size={'lg'} className="w-full">
									Guardar
								</Button>
								<Button
									size={'lg'}
									variant={'secondary'}
									className="w-full"
									asChild
								>
									<Link href="/dashboard">Cancelar</Link>
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</section>
	)
}
