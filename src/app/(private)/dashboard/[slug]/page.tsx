'use client'

import { useToast } from '@/app/hooks/use-toast'
import queryGetData from '@/app/services/query-request'
import {
	getProjectBySlug,
	setFavoriteProject,
} from '@/app/services/server-actions'
import ProjectGroups from '@/components/project-groups'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { PROJECT_KEY, PROJECTS_SELECTOR_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { queryClient } from '@/providers/tanstack-query'
import { Project } from '@prisma/client'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ProjectPage({
	params: { slug },
}: {
	params: { slug: string }
}) {
	const { setMessage } = useToast()
	const [lastFavorite, setLastFavorite] = useState<boolean | undefined>(
		undefined,
	)

	const { data: project, isLoading: isLoadingProjects } =
		queryGetData<Project | null>(
			[PROJECT_KEY, { slug }],
			() => getProjectBySlug(slug),
			slug ? true : false,
		)

	function handleFavorite() {
		setFavoriteProject(slug, !project?.favorite)
		queryClient.invalidateQueries({
			queryKey: [PROJECT_KEY],
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

	return (
		<>
			{isLoadingProjects && <Skeleton className="bg-primary/80 min-w-56 h-9" />}
			{!isLoadingProjects && project && (
				<section className="flex flex-col flex-1 overflow-hidden h-full">
					<div className="flex flex-col">
						<div className="flex gap-3 items-center">
							{/* <Button
								className="mt-[7px]"
								variant={'outline'}
								size={'icon-sm'}
								onClick={handleFavorite}
							> */}
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
							<div className="flex flex-col"></div>
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
