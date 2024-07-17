'use client'

import queryGetData from '@/app/services/query-request'
import {
	getProjectBySlug,
	setFavoriteProject,
} from '@/app/services/server-actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { PROJECT_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { queryClient } from '@/providers/tanstack-query'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ProjectPage({
	params: { slug },
}: {
	params: { slug: string }
}) {
	const [lastFavorite, setLastFavorite] = useState(undefined)
	const { data: project, isLoading } = queryGetData(
		[...PROJECT_KEY, slug],
		() => getProjectBySlug(slug),
	)

	function handleFavorite() {
		setFavoriteProject(slug, !project.favorite)
		queryClient.invalidateQueries({
			queryKey: [...PROJECT_KEY, slug],
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
				toast.success(
					`El proyecto se ha ${project.favorite ? 'marcado' : 'desmarcado'} como favorito`,
				)
			}
		}
	}, [project])

	return (
		<>
			{isLoading && <Skeleton className="bg-primary/80 min-w-56 h-9" />}
			{!isLoading && project && (
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
								<Label className="text-2xl w-2/4 uppercase">
									{project.name}
								</Label>
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
					<div className="flex flex-1 flex-col items-center bg-secondary px-4 py-2 rounded-lg mt-3 overflow-auto h-full">
						<section className="grid grid-cols-2 gap-2 w-full items-center justify-center">
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
							<div className="flex flex-1 justify-center min-h-24 border-2 border-gray-400 rounded-lg">
								<Label className="text-2xl uppercase">Notas</Label>
							</div>
						</section>
					</div>
				</section>
			)}
		</>
	)
}
