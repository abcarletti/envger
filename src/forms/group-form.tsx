import { AutoSizeTextarea } from '@/components/ui/auto-size-textarea'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { GROUPS_KEY, GROUPS_NAV_KEY } from '@/lib/constants'
import { getTagByName } from '@/lib/utils'
import { useProjectStore } from '@/providers/project-store-provider'
import { queryClient } from '@/providers/tanstack-query'
import { createProjectGroupSchema } from '@/schemas/group'
import { createOrUpdateGroup } from '@/services/server-actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Group } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const GroupForm = ({
	group,
	dialogOpen,
}: {
	group?: Group
	dialogOpen: (open: boolean) => void
}) => {
	const { setMessage } = useToast()
	const { project } = useProjectStore((store) => store)

	const form = useForm<z.infer<typeof createProjectGroupSchema>>({
		resolver: zodResolver(createProjectGroupSchema),
		defaultValues: {
			name: group?.name || '',
			description: group?.description || '',
			tag: group?.tag || '',
		},
	})

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		form.setValue('name', e.target.value)
		form.setValue('tag', getTagByName(e.target.value))
	}

	const { reset } = form

	const onSubmit = async (values: z.infer<typeof createProjectGroupSchema>) => {
		try {
			if (project) {
				await createOrUpdateGroup(group?.id || '', values, project)
				setMessage({ message: 'Grupo creado correctamente', type: 'success' })

				await queryClient.invalidateQueries({
					queryKey: [GROUPS_KEY],
				})

				await queryClient.invalidateQueries({
					queryKey: [GROUPS_NAV_KEY],
				})

				reset()
				dialogOpen(false)
			} else {
				setMessage({
					message: 'No se ha podido guardar el grupo',
					type: 'error',
				})
			}
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
				setMessage({
					message: 'Se ha producido un error al guardar el grupo',
					type: 'error',
				})
			}
		}
	}

	return (
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
									<AutoSizeTextarea {...field} />
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
	)
}
