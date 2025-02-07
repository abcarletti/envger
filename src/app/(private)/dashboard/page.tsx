'use client'

import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { PROJECT_KEY, PROJECTS_SELECTOR_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { queryClient } from '@/providers/tanstack-query'
import queryGetData from '@/services/query-request'
import {
	getSelectorProjects,
	setFavoriteProject,
} from '@/services/server-actions'
import { Project } from '@prisma/client'
import { Star } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
	const { data: projects, isLoading } = queryGetData<Project[]>(
		[PROJECTS_SELECTOR_KEY],
		() => getSelectorProjects(),
		true,
	)

	function handleFavorite(slug: string, favorite: boolean) {
		setFavoriteProject(slug, favorite)
		invalidateProjectsQuery(slug)
	}

	const invalidateProjectsQuery = (slug: string) => {
		queryClient.removeQueries({
			queryKey: [PROJECT_KEY, { slug }],
		})
		queryClient.invalidateQueries({
			queryKey: [PROJECTS_SELECTOR_KEY],
		})
	}
	return (
		<div className="flex items-center justify-center flex-1">
			<section className="flex flex-col bg-secondary w-10/12 md:w-9/12 lg:w-5/6 xl:w-7/12 rounded-md p-4 h-4/6 gap-4">
				<Label className="text-primary text-2xl font-semibold">Proyectos</Label>
				<div className="flex flex-col gap-2 pl-4 overflow-auto">
					{isLoading && (
						<>
							<div className="flex gap-2 items-center">
								<Skeleton className="bg-background/70 w-6 h-7" />
								<Skeleton className="bg-background/70 w-full h-7" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="bg-background/70 w-6 h-7" />
								<Skeleton className="bg-background/70 w-full h-7" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="bg-background/70 w-6 h-7" />
								<Skeleton className="bg-background/70 w-full h-7" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="bg-background/70 w-6 h-7" />
								<Skeleton className="bg-background/70 w-full h-7" />
							</div>
							<div className="flex gap-2">
								<Skeleton className="bg-background/70 w-6 h-7" />
								<Skeleton className="bg-background/70 w-full h-7" />
							</div>
						</>
					)}
					{!isLoading && projects && projects.length > 0 && (
						<>
							{projects.map((project) => (
								<div key={project.id} className="flex gap-2 items-center">
									<Star
										onClick={() =>
											handleFavorite(project.slug, !project.favorite)
										}
										className={cn(
											project.favorite ? 'text-yellow-600 fill-current' : '',
											'size-5 cursor-pointer hover:text-yellow-600',
										)}
									/>
									<Link
										href={`/dashboard/${project.slug}`}
										className="text-foreground w-full hover:text-foreground/70"
									>
										<div className="flex gap-4 items-center">
											<Label className="text-md cursor-pointer min-w-[20%]">
												{project.name}
											</Label>
											<p className="flex text-sm text-gray-400 max-w-[80%] overflow-hidden ">
												{project.description}
											</p>
										</div>
									</Link>
								</div>
							))}
						</>
					)}
				</div>
			</section>
		</div>
	)
}
