'use client'

import queryGetData from '@/app/services/query-request'
import { getSelectorProjects } from '@/app/services/server-actions'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PROJECTS_SELECTOR_KEY } from '@/lib/constants'
import { useProjectStore } from '@/providers/project-store-provider'
import { Project } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export default function ProjectSelector() {
	const { push } = useRouter()
	const pathname = usePathname()

	const { data: projects, isLoading } = queryGetData(
		PROJECTS_SELECTOR_KEY,
		() => getSelectorProjects(),
	)

	const { project, updateProjectContext, updateProjectContextBySlug } =
		useProjectStore((store) => store)

	useEffect(() => {
		if (pathname.includes('/dashboard')) {
			const slug = pathname.split('/dashboard/')[1]
			if (slug && slug != 'create') {
				const project = projects?.find((p: Project) => p.slug === slug)
				if (project) {
					updateProjectContext(project)
				} else {
					updateProjectContextBySlug(slug)
				}
			} else {
				updateProjectContext(undefined)
			}
		}
	}, [pathname])

	return (
		<>
			{isLoading && <Skeleton className="bg-primary/80 min-w-60 h-9" />}
			{!isLoading && (!projects || projects.length === 0) && (
				<Button
					variant="outline"
					size="sm"
					disabled
					className="justify-normal min-w-60 h-9"
				>
					No hay proyectos
				</Button>
			)}
			{!isLoading && projects && projects.length > 0 && (
				<Select
					onValueChange={(value) => {
						push(`/dashboard/${value}`)
						updateProjectContext(
							projects?.find((p: Project) => p.slug === value),
						)
					}}
					value={project?.slug || ''}
				>
					<SelectTrigger className="w-min min-w-60">
						<SelectValue placeholder="Selecciona un proyecto" />
					</SelectTrigger>
					<SelectContent>
						{projects.filter((p: Project) => p.favorite).length > 0 && (
							<SelectGroup>
								<SelectLabel className="text-xs text-gray-500">
									Favoritos
								</SelectLabel>
								{projects
									.filter((p: Project) => p.favorite)
									.map((project: Project) => (
										<SelectItem key={project.id} value={project.slug}>
											{project.slug}
										</SelectItem>
									))}
							</SelectGroup>
						)}
						{projects.filter((p: Project) => !p.favorite).length > 0 && (
							<SelectGroup>
								<SelectLabel className="text-xs text-gray-500">
									Otros
								</SelectLabel>
								{projects
									.filter((p: Project) => !p.favorite)
									.map((project: Project) => (
										<SelectItem key={project.id} value={project.slug}>
											{project.slug}
										</SelectItem>
									))}
							</SelectGroup>
						)}
					</SelectContent>
				</Select>
			)}
		</>
	)
}
