'use client'

import AddGroupButton from '@/components/add-group-button'
import ConfirmDialog from '@/components/confirm-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import ProjectForm from '@/forms/project-form'
import { useToast } from '@/hooks/use-toast'
import { PROJECT_KEY, PROJECTS_SELECTOR_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/providers/project-store-provider'
import { queryClient } from '@/providers/tanstack-query'
import { deleteProject } from '@/services/project-service'
import { setFavoriteProject } from '@/services/server-actions'
import { Settings, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export default function SlugLayout({
	children,
	params: { slug },
}: {
	children: React.ReactNode
	params: { slug: string }
}) {
	const { push } = useRouter()
	const { setMessage } = useToast()
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

	const { project: projectStore, updateProjectContextBySlug } = useProjectStore(
		(store) => store,
	)

	async function handleFavorite() {
		setFavoriteProject(slug, !projectStore?.favorite)
		await updateProjectContextBySlug(slug)
		invalidateProjectsQuery()
		setMessage({
			message: `El proyecto se ha ${!projectStore?.favorite ? 'marcado' : 'desmarcado'} como favorito`,
			type: 'success',
		})
	}

	const invalidateProjectsQuery = (remove: boolean = false) => {
		if (remove) {
			queryClient.removeQueries({
				queryKey: [PROJECT_KEY, { slug }],
			})
			queryClient.removeQueries({
				queryKey: [PROJECTS_SELECTOR_KEY],
			})
		} else {
			queryClient.invalidateQueries({
				queryKey: [PROJECT_KEY, { slug }],
			})
			queryClient.invalidateQueries({
				queryKey: [PROJECTS_SELECTOR_KEY],
			})
		}
	}

	const handleDeleteProject = async (projectId: string | undefined) => {
		if (!projectId) return
		try {
			await deleteProject(projectId)
			setMessage({
				message: 'Proyecto eliminado correctamente',
				type: 'success',
			})
			invalidateProjectsQuery(true)
			push('/dashboard')
		} catch (error) {
			console.error(error)
			setMessage({
				message: 'Error al eliminar el proyecto',
				type: 'error',
			})
		}
	}
	return (
		<>
			<div className="flex flex-col h-full">
				<div className="sticky top-0 z-10 bg-background">
					<header className="flex h-14 shrink-0 items-center gap-2 border-b">
						<div className="flex flex-1 items-center gap-2 px-3">
							<SidebarTrigger />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<div className="flex items-center justify-between w-full">
								<div className="flex gap-3 items-center">
									<Star
										onClick={handleFavorite}
										className={cn(
											projectStore?.favorite
												? 'text-yellow-500 fill-current'
												: '',
											'size-5 cursor-pointer hover:text-yellow-500',
										)}
									/>
									<Label className="text-2xl uppercase">
										{projectStore?.name}
									</Label>
								</div>
								<div className="flex md:pl-8 items-center gap-3">
									<AddGroupButton />
									<Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
										<DropdownMenu>
											<DropdownMenuTrigger className="flex items-center focus:outline-none h-7">
												<Settings className="size-4" />
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem className="p-0">
													<DialogTrigger className="w-full" asChild>
														<Button
															size={'sm'}
															variant={'ghost'}
															className="w-full"
														>
															Editar
														</Button>
													</DialogTrigger>
												</DropdownMenuItem>
												<DropdownMenuItem className="p-0">
													<Button
														size={'sm'}
														variant={'destructive'}
														className="w-full"
														onClick={() => setOpenDeleteDialog(true)}
													>
														Eliminar
													</Button>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
										<DialogContent className="sm:max-w-md">
											<DialogHeader>
												<DialogTitle>
													Editar proyecto: {projectStore?.name}
												</DialogTitle>
												<DialogDescription>
													Modifica los valores del proyecto
												</DialogDescription>
											</DialogHeader>
											<ProjectForm
												project={projectStore}
												modal={true}
												dialogOpen={setSettingsOpen}
												cancelButton={
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
												}
											/>
										</DialogContent>
									</Dialog>
								</div>
							</div>
						</div>
					</header>
				</div>
				<div className="flex-1 overflow-auto">{children}</div>
			</div>
			<ConfirmDialog
				showTrigger={false}
				buttonContent={'Eliminar'}
				buttonStyle={twMerge(
					buttonVariants({
						size: 'sm',
						variant: 'destructive',
					}),
					'w-full',
				)}
				title={`¿Deseas eliminar el proyecto ${projectStore?.name}?`}
				content={
					<>
						¿Estás seguro de que deseas eliminar el proyecto{' '}
						<span className="uppercase text-primary">{projectStore?.name}</span>{' '}
						y toda la información relacionada? Si confirma no se podrá
						recuperar.
					</>
				}
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(!openDeleteDialog)}
				onConfirm={() => {
					handleDeleteProject(projectStore?.id)
					setOpenDeleteDialog(false)
				}}
			/>
		</>
	)
}
