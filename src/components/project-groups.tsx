'use client'

import { useToast } from '@/hooks/use-toast'
import { GROUPS_KEY, GROUPS_NAV_KEY } from '@/lib/constants'
import { useProjectStore } from '@/providers/project-store-provider'
import { queryClient } from '@/providers/tanstack-query'
import queryGetData from '@/services/query-request'
import { deleteGroup, getProjectGroupsBySlug } from '@/services/server-actions'
import { Group } from '@prisma/client'
import { Boxes } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddGroupButton from './add-group-button'
import GroupArticle from './compose-group-article'
import { Label } from './ui/label'

export default function ProjectGroups() {
	const { setMessage } = useToast()
	const [groupSelected, setGroupSelected] = useState<string | null>(null)
	const [groupsComposed, setGroupsComposed] = useState<React.JSX.Element[]>([])
	const searchParams = useSearchParams()
	const { push } = useRouter()
	const pathname = usePathname()
	const { project } = useProjectStore((store) => store)

	const { data: groups, isLoading: isLoadingGroups } = queryGetData<Group[]>(
		[
			GROUPS_KEY,
			{
				slug: project?.slug,
				group: groupSelected,
			},
		],
		() => getProjectGroupsBySlug(project?.slug || '', groupSelected),
		project != undefined ? true : false,
	)

	const handleEditGroup = async () => {
		invalidateGroupsQuery()
		setMessage({
			message: 'Grupo editado correctamente',
			type: 'success',
		})
	}

	const handleDeleteGroup = async (id: string) => {
		try {
			await deleteGroup(id, project?.id || '')
			setMessage({
				message: 'Grupo eliminado correctamente',
				type: 'success',
			})
			invalidateGroupsQuery()
			push(pathname)
		} catch (error) {
			setMessage({
				message: 'Error al eliminar el grupo',
				type: 'error',
			})
		}
	}

	const invalidateGroupsQuery = async () => {
		if (project) {
			await queryClient.invalidateQueries({
				queryKey: [GROUPS_KEY],
			})
			await queryClient.invalidateQueries({
				queryKey: [GROUPS_NAV_KEY],
			})
		}
	}

	useEffect(() => {
		if (groups) {
			const sections: React.JSX.Element[] = []
			for (let i = 0; i < groups.length; i += 2) {
				const firstElement: Group = groups[i]
				const secondElement: Group = groups[i + 1]

				if (firstElement) {
					sections.push(
						<div
							key={`section-${firstElement.id}`}
							className="flex flex-col xl:flex-row gap-2 w-full items-stretch "
						>
							<GroupArticle
								key={`first-${firstElement.id}`}
								group={firstElement}
								handleEditGroup={() => handleEditGroup()}
								handleDeleteGroup={() => handleDeleteGroup(firstElement.id)}
							/>
							{secondElement && (
								<GroupArticle
									key={`second-${secondElement.id}`}
									group={secondElement}
									handleEditGroup={() => handleEditGroup()}
									handleDeleteGroup={() => handleDeleteGroup(secondElement.id)}
								/>
							)}
						</div>,
					)
				}
			}
			setGroupsComposed(sections)
		}
	}, [groups])

	useEffect(() => {
		if (
			searchParams &&
			searchParams.get('tag') &&
			searchParams.get('tag') != ''
		) {
			setGroupSelected(searchParams.get('tag'))
		} else {
			setGroupSelected(null)
		}
	}, [searchParams])

	return (
		<>
			{!isLoadingGroups && groupsComposed.length > 0 && groupsComposed}
			{!isLoadingGroups && groupsComposed.length <= 0 && (
				<section className="flex flex-1 flex-col gap-8 items-center justify-center">
					<Boxes className="size-20 text-primary" />
					<Label className="text-2xl uppercase">No hay grupos</Label>
					<AddGroupButton />
				</section>
			)}
		</>
	)
}
