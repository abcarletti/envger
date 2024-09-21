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
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export default function ProjectSelector() {
	const { push } = useRouter()
	const pathname = usePathname()
	const [showProjectSelector, setShowProjectSelector] = useState<boolean>(false)

	const { data: projects, isLoading } = queryGetData<Project[]>(
		[PROJECTS_SELECTOR_KEY],
		() => getSelectorProjects(),
		showProjectSelector,
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
		if (pathname) {
			const isDashboard = pathname === '/dashboard'
			const isCreate = pathname === '/dashboard/create'
			setShowProjectSelector(!isDashboard && !isCreate)
		}
	}, [pathname])

	return (
		<>
			{showProjectSelector && isLoading && (
				<Skeleton className="bg-primary/80 min-w-60 h-9" />
			)}
			{showProjectSelector &&
				!isLoading &&
				(!projects || projects.length === 0) && (
					<Button
						variant="outline"
						size="sm"
						disabled
						className="justify-normal min-w-60 h-9"
					>
						No hay proyectos
					</Button>
				)}
			{showProjectSelector && !isLoading && projects && projects.length > 0 && (
				<Select
					onValueChange={(value) => {
						push(`/dashboard/${value}`)
						updateProjectContext(
							projects?.find((p: Project) => p.slug === value),
						)
					}}
					value={project?.slug || ''}
				>
					<SelectTrigger className="w-min min-w-52">
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
											{project.name}
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
											{project.name}
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
