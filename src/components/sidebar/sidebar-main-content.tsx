'use client'

import { GROUPS_NAV_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/providers/project-store-provider'
import queryGetData from '@/services/query-request'
import { getProjectGroupsBySlug } from '@/services/server-actions'
import { ChevronRight, FolderCode, NotebookPen, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '../ui/collapsible'
import { Label } from '../ui/label'
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '../ui/sidebar'

export const SidebarMainContent = () => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [groupSelected, setGroupSelected] = useState<string | null>(null)

	const { project } = useProjectStore((store) => store)

	const { data: groups, isLoading: isLoadingGroups } = queryGetData(
		[
			GROUPS_NAV_KEY,
			{
				slug: project?.slug,
			},
		],
		() => getProjectGroupsBySlug(project?.slug || '', null),
		project && project != undefined && project.slug ? true : false,
	)

	const selectGroup = (tag: string) => {
		if (groupSelected === tag) {
			setGroupSelected(null)
			router.push(`${pathname}`)
			return
		} else {
			setGroupSelected(tag)
			const newParams = new URLSearchParams({ tag }) // Reemplaza 'newTagValue' con el valor deseado
			router.push(`/dashboard/${project?.slug}?${newParams.toString()}`)
		}
	}

	useEffect(() => {
		const tag = searchParams.get('tag')
		if (tag) {
			setGroupSelected(tag)
		}
	}, [searchParams])

	return (
		<>
			{(isLoadingGroups || !groups) && null}
			{!isLoadingGroups && groups && (
				<SidebarGroup>
					{/* <SidebarGroupLabel>Grupos</SidebarGroupLabel> */}
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								tooltip={`Notas del proyecto: ${project?.name}`}
							>
								<Link href={`/dashboard/${project?.slug}/notes`}>
									<NotebookPen />
									<span>Notas</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<Collapsible asChild defaultOpen className="group/collapsible">
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton
										asChild
										tooltip={`Grupos del proyecto ${project?.name}`}
									>
										<Link href={`/dashboard/${project?.slug}`}>
											<FolderCode />
											<span>Grupos</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
										</Link>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{groups?.map((group) => (
											<SidebarMenuSubItem key={group.id}>
												<SidebarMenuSubButton
													onClick={() => selectGroup(group.tag)}
													className={cn(
														'flex justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
														group.tag === groupSelected
															? 'bg-primary/10 text-primary'
															: '',
													)}
												>
													<Label>{group.name}</Label>
													<X
														className={cn(
															'size-4',
															group.tag === groupSelected ? 'block' : 'hidden',
														)}
													/>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
				</SidebarGroup>
			)}
		</>
	)
}
