'use client'

import { useToast } from '@/app/hooks/use-toast'
import { deleteProject } from '@/app/services/project-service'
import queryGetData from '@/app/services/query-request'
import {
	getProjectBySlug,
	setFavoriteProject,
} from '@/app/services/server-actions'
import AddGroupButton from '@/components/add-group-button'
import ConfirmDialog from '@/components/confirm-dialog'
import ProjectGroups from '@/components/project-groups'
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
import { Skeleton } from '@/components/ui/skeleton'
import ProjectForm from '@/forms/project-form'
import { PROJECT_KEY, PROJECTS_SELECTOR_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { queryClient } from '@/providers/tanstack-query'
import { Project } from '@prisma/client'
import { Settings, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export default function ProjectPage({
	params: { slug },
}: {
	params: { slug: string }
}) {
	const { setMessage } = useToast()
	const { push } = useRouter()
	const [lastFavorite, setLastFavorite] = useState<boolean | undefined>(
		undefined,
	)
	const [settingsOpen, setSettingsOpen] = useState(false)
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

	const { data: project, isLoading: isLoadingProjects } =
		queryGetData<Project | null>(
			[PROJECT_KEY, { slug }],
			() => getProjectBySlug(slug),
			slug ? true : false,
		)

	function handleFavorite() {
		setFavoriteProject(slug, !project?.favorite)
		invalidateProjectsQuery()
	}

	const invalidateProjectsQuery = () => {
		queryClient.invalidateQueries({
			queryKey: [PROJECT_KEY, { slug }],
		})
		queryClient.invalidateQueries({
			queryKey: [PROJECTS_SELECTOR_KEY],
		})
	}

	useEffect(() => {
		if (lastFavorite === undefined && project) {
			setLastFavorite(project?.favorite)
			return
		}
		if (project) {
			if (lastFavorite !== project.favorite) {
				setLastFavorite(project?.favorite)
				setMessage({
					message: `El proyecto se ha ${project.favorite ? 'marcado' : 'desmarcado'} como favorito`,
					type: 'success',
				})
			}
		}
	}, [project])

	const handleDeleteProject = async (projectId: string | undefined) => {
		if (!projectId) return
		try {
			await deleteProject(projectId)
			setMessage({
				message: 'Proyecto eliminado correctamente',
				type: 'success',
			})
			invalidateProjectsQuery()
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
			{isLoadingProjects && <Skeleton className="bg-primary/80 min-w-56 h-9" />}
			{!isLoadingProjects && project && (
				<section className="flex flex-col flex-1 overflow-hidden h-full bg-background">
					<div className="flex justify-between">
						<div className="grid grid-cols-2 md:flex gap-3 flex-col md:flex-row md:items-center">
							<div className="flex gap-3 items-center">
								<Star
									onClick={handleFavorite}
									className={cn(
										project.favorite ? 'text-yellow-500 fill-current' : '',
										'size-5 cursor-pointer hover:text-yellow-500',
									)}
								/>
								<Label className="text-2xl uppercase">{project.name}</Label>
							</div>
							<div className="flex items-end md:max-w-full h-full md:ml-2 mb-[4px] text-balance">
								<Label className="text-[0.7rem] text-gray-400">
									{project?.description?.substring(0, 90)}
								</Label>
							</div>
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
										<DialogTitle>Editar proyecto: {project.name}</DialogTitle>
										<DialogDescription>
											Modifica los valores del proyecto
										</DialogDescription>
									</DialogHeader>
									<ProjectForm
										project={project}
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
					<div className="flex flex-1 flex-col gap-2 items-center rounded-lg mt-4 overflow-auto h-full">
						<Suspense>
							<ProjectGroups />
						</Suspense>
					</div>
				</section>
			)}
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
				title={`¿Deseas eliminar el proyecto ${project?.name}?`}
				content={
					<>
						¿Estás seguro de que deseas eliminar el proyecto{' '}
						<span className="uppercase text-primary">{project?.name}</span> y
						toda la información relacionada? Si confirma no se podrá recuperar.
					</>
				}
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(!openDeleteDialog)}
				onConfirm={() => {
					handleDeleteProject(project?.id)
					setOpenDeleteDialog(false)
				}}
			/>
		</>
	)
}
