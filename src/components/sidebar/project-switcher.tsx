'use client'

import { ChevronsUpDown, Code, GalleryVerticalEnd, Plus } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { PROJECTS_SELECTOR_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/providers/project-store-provider'
import queryGetData from '@/services/query-request'
import { getSelectorProjects } from '@/services/server-actions'
import { Project } from '@prisma/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Avatar } from '../ui/avatar'
import { Skeleton } from '../ui/skeleton'

export function ProjectSwitcher() {
	const { push } = useRouter()
	const pathname = usePathname()

	const { isMobile, open } = useSidebar()

	const [startProjects, setStartProjects] = useState<Project[]>([])
	const [otherProjects, setOtherProjects] = useState<Project[]>([])

	const { data: projects, isLoading } = queryGetData<Project[]>(
		[PROJECTS_SELECTOR_KEY],
		() => getSelectorProjects(),
	)

	const { project, updateProjectContext, updateProjectContextBySlug } =
		useProjectStore((store) => store)

	useEffect(() => {
		if (projects) {
			setStartProjects(projects.filter((p: Project) => p.favorite))
			setOtherProjects(projects.filter((p: Project) => !p.favorite))
		}
	}, [projects])

	useEffect(() => {
		if (pathname.includes('/dashboard')) {
			const slugAux = pathname.split('/dashboard/')[1]
			const slug = slugAux?.split('/')[0]
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
		<SidebarMenu className="gap-2">
			<div className="flex items-center justify-between">
				<SidebarMenuButton
					asChild
					size="lg"
					className={cn('hidden md:block', {
						'bg-background': !open,
					})}
				>
					<Link href="/dashboard" className="font-semibold w-full">
						{!open && (
							<Avatar className="flex items-center justify-center size-8 rounded-lg text-primary">
								<Code className="size-5" />
							</Avatar>
						)}
						{open && (
							<div className="flex flex-1 text-left text-xs leading-tight justify-center">
								<h1 className="px-0 text-secondary-foreground text-xl font-semibold items-center justify-center">
									<span className="text-primary text-2xl">{'<'}</span>
									Envger
									<span className="text-primary"> {'/>'}</span>
								</h1>
							</div>
						)}
					</Link>
				</SidebarMenuButton>
			</div>
			{/* <Separator className="my-2" /> */}
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
						>
							{isLoading && (
								<Skeleton className="bg-primary/80 h-full w-full" />
							)}
							{!isLoading && (
								<>
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
										<GalleryVerticalEnd className="size-4" />
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{project?.name || 'Escoger proyecto'}
										</span>
									</div>
									<ChevronsUpDown className="ml-auto" />
								</>
							)}
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="start"
						side={isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						{startProjects.length > 0 && (
							<>
								<DropdownMenuLabel className="text-xs text-muted-foreground">
									Favoritos
								</DropdownMenuLabel>
								{startProjects.map((project) => (
									<DropdownMenuItem
										key={project.slug}
										onClick={() => {
											push(`/dashboard/${project.slug}`)
											updateProjectContext(project)
										}}
										className="gap-2 p-2"
									>
										<div className="flex size-6 items-center justify-center rounded-sm border">
											<GalleryVerticalEnd className="size-4 shrink-0" />
										</div>
										{project.name}
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
							</>
						)}
						{otherProjects.length > 0 && (
							<>
								<DropdownMenuLabel className="text-xs text-muted-foreground">
									Proyectos
								</DropdownMenuLabel>
								{otherProjects.map((project) => (
									<DropdownMenuItem
										key={project.slug}
										onClick={() => {
											push(`/dashboard/${project.slug}`)
											updateProjectContext(project)
										}}
										className="gap-2 p-2"
									>
										<div className="flex size-6 items-center justify-center rounded-sm border">
											<GalleryVerticalEnd className="size-4 shrink-0" />
										</div>
										{project.name}
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
							</>
						)}
						<DropdownMenuItem className="gap-2 p-2 cursor-pointer" asChild>
							<Link href="/dashboard/create">
								<div className="flex size-6 items-center justify-center rounded-md border bg-background">
									<Plus className="size-4" />
								</div>
								<div className="font-medium text-muted-foreground">
									Añadir proyecto
								</div>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
