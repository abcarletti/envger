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
import { Project } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export default function ProjectSelector() {
	const { push } = useRouter()
	const pathname = usePathname()
	const [slugPath, setSlugPath] = useState<string | undefined>(undefined)

	useEffect(() => {
		if (pathname.includes('/dashboard/')) {
			setSlugPath(pathname.split('/dashboard/')[1])
		}
	}, [pathname])

	const { data: projects, isLoading } = queryGetData(
		PROJECTS_SELECTOR_KEY,
		() => getSelectorProjects(),
	)

	return (
		<>
			{isLoading && <Skeleton className="bg-primary/80 min-w-56 h-9" />}
			{!isLoading && (!projects || projects.length === 0) && (
				<Button
					variant="outline"
					size="sm"
					disabled
					className="justify-normal min-w-56 h-9"
				>
					No hay proyectos
				</Button>
			)}
			{!isLoading && projects && projects.length > 0 && (
				<Select
					onValueChange={(value) => {
						push(`/dashboard/${value}`)
						setSlugPath(value)
					}}
					value={slugPath}
				>
					<SelectTrigger className="w-min min-w-56">
						<SelectValue placeholder="Selecciona un proyecto" />
					</SelectTrigger>
					<SelectContent>
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
						<SelectGroup>
							<SelectLabel className="text-xs text-gray-500">Otros</SelectLabel>
							{projects
								.filter((p: Project) => !p.favorite)
								.map((project: Project) => (
									<SelectItem key={project.id} value={project.slug}>
										{project.slug}
									</SelectItem>
								))}
						</SelectGroup>
					</SelectContent>
				</Select>
			)}
		</>
	)
}
