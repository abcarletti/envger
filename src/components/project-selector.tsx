'use client'

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { getSelectorProjects } from '@/app/services/server-actions'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'

export default function ProjectSelector() {
	const { push } = useRouter()
	const pathname = usePathname()
	const [projects, setProjects] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	let slugPath = undefined

	if (pathname.includes('/dashboard/')) {
		const slug = pathname.split('/dashboard/')[1]
		slugPath = slug
	}

	useEffect(() => {
		getSelectorProjects().then((projects) => {
			setProjects(projects)
			setIsLoading(false)
		})
	}, [])

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
					}}
					defaultValue={slugPath}
				>
					<SelectTrigger className="w-min min-w-56">
						<SelectValue placeholder="Selecciona un proyecto" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{projects.map((project) => (
								<SelectItem key={project.id} value={project.slug}>
									{project.name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			)}
		</>
	)
}
