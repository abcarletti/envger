'use client'

import { useToast } from '@/app/hooks/use-toast'
import { deleteProject } from '@/app/services/project-service'
import queryGetData from '@/app/services/query-request'
import {
	getProjectBySlug,
	setFavoriteProject,
} from '@/app/services/server-actions'
import ProjectGroups from '@/components/project-groups'
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
import { useEffect, useState } from 'react'

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
		queryClient.removeQueries({
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

	const handleDeleteProject = async (projectId: string) => {
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
				<section className="flex flex-col flex-1 overflow-hidden h-full w-full">
					<div className="flex justify-between">
						<div className="flex gap-3 items-center">
							<Star
								onClick={handleFavorite}
								className={cn(
									project.favorite ? 'text-yellow-500 fill-current' : '',
									'size-5 cursor-pointer',
								)}
							/>
							{/* </Button> */}
							<Label className="text-2xl uppercase">{project.name}</Label>
							<div className="flex items-end flex-1 h-full ml-2 mb-[4px]">
								<Label className="text-[0.7rem] text-gray-400">
									{project.description}
								</Label>
							</div>
						</div>
						<div className="flex pl-8 items-center">
							<div className="flex flex-col">
								<Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
									<DropdownMenu>
										<DropdownMenuTrigger className="flex items-center focus:outline-none mt-2">
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
													onClick={() => handleDeleteProject(project.id)}
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
											dialogOpen={setSettingsOpen}
										/>
									</DialogContent>
								</Dialog>
							</div>
						</div>
					</div>
					<div className="flex flex-1 flex-col gap-2 items-center rounded-lg mt-4 overflow-auto h-full">
						<ProjectGroups />
					</div>
				</section>
			)}
		</>
	)
}
