'use client'

import { useToast } from '@/app/hooks/use-toast'
import queryGetData from '@/app/services/query-request'
import {
	getProjectBySlug,
	setFavoriteProject,
} from '@/app/services/server-actions'
import { ProjectGroups } from '@/components/project-groups'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { PROJECT_KEY, PROJECTS_SELECTOR_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { queryClient } from '@/providers/tanstack-query'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ProjectPage({
	params: { slug },
}: {
	params: { slug: string }
}) {
	const { setMessage } = useToast()
	const [lastFavorite, setLastFavorite] = useState(undefined)

	const { data: project, isLoading: isLoadingProjects } = queryGetData(
		[...PROJECT_KEY, slug],
		() => getProjectBySlug(slug),
	)

	function handleFavorite() {
		setFavoriteProject(slug, !project.favorite)
		queryClient.invalidateQueries({
			queryKey: [...PROJECT_KEY, slug],
		})
		queryClient.invalidateQueries({
			queryKey: PROJECTS_SELECTOR_KEY,
		})
	}

	useEffect(() => {
		if (lastFavorite === undefined && project) {
			setLastFavorite(project.favorite)
			return
		}
		if (project) {
			if (lastFavorite !== project.favorite) {
				setLastFavorite(project.favorite)
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
					<div className="flex w-full items-center bg-secondary px-4 py-2 justify-between rounded-lg">
						<div className="flex gap-4 items-center">
							{project.imageUrl && (
								<Image
									src={project.imageUrl}
									alt={project.name}
									className="size-10 rounded-full object-center"
									height={56}
									width={56}
								/>
							)}
							<div className="flex flex-col">
								<Label className="text-2xl uppercase">{project.name}</Label>
								<Label className="text-[0.7rem] text-gray-400">
									{project.description}
								</Label>
							</div>
						</div>
						<Button variant={'outline'} size={'sm'} onClick={handleFavorite}>
							<div className="flex items-center gap-4 p-2">
								<Label className="text-xs">
									{project.favorite
										? 'Quitar favorito'
										: 'Marcar como favorito'}
								</Label>
								<Star
									className={cn(
										project.favorite ? 'text-yellow-500 fill-current' : '',
										'size-5',
									)}
								/>
							</div>
						</Button>
					</div>
					<div className="flex flex-1 flex-col gap-y-2 items-center bg-secondary px-4 py-2 rounded-lg mt-3 overflow-auto h-full">
						<ProjectGroups slug={slug} />
					</div>
				</section>
			)}
		</>
	)
}
