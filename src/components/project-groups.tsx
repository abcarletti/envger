'use client'

import { useToast } from '@/app/hooks/use-toast'
import queryGetData from '@/app/services/query-request'
import { getProjectGroupsBySlug } from '@/app/services/server-actions'
import { GROUPS_KEY } from '@/lib/constants'
import { useProjectStore } from '@/providers/project-store-provider'
import { queryClient } from '@/providers/tanstack-query'
import { Group } from '@prisma/client'
import { Settings } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddGroupButtom from './add-group-buttom'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Label } from './ui/label'

const composeGroupArticle = (
	{ name, description }: Group,
	hadleEditGroup: () => void,
	hadleDeleteGroup: () => void,
) => {
	const editGroup = () => {
		console.log('Edit group')
		hadleEditGroup()
	}

	return (
		<article className="flex flex-col flex-1 items-center min-h-24 border-2 border-gray-400 rounded-lg py-2 max-w-group">
			<div className="flex w-full justify-between px-4">
				<div className="flex flex-col">
					<Label className="text-xl uppercase">{name}</Label>
					<Label className="text-sm text-gray-400">{description}</Label>
				</div>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center focus:outline-none mt-2">
							<Settings className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>
								<Button
									size={'sm'}
									variant={'ghost'}
									className="w-full"
									onClick={editGroup}
								>
									Editar
								</Button>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button
									size={'sm'}
									variant={'destructive'}
									className="w-full"
									onClick={hadleDeleteGroup}
								>
									Eliminar
								</Button>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</article>
	)
}

export const ProjectGroups = ({ slug }: { slug: string }) => {
	const { setMessage } = useToast()
	const [groupSelected, setGroupSelected] = useState<string | null>(null)
	const [groupsComposed, setGroupsComposed] = useState<React.JSX.Element[]>([])
	const searchParams = useSearchParams()
	const { push } = useRouter()
	const pathname = usePathname()
	const { project } = useProjectStore((store) => store)

	const { data: groups, isLoading: isLoadingGroups } = queryGetData(
		[...GROUPS_KEY, project?.slug || '', groupSelected || 'all-groups'],
		() => getProjectGroupsBySlug(project?.slug || '', null),
	)

	const handleEditGroup = async (id: string) => {
		console.log(`Editar grupo ${id}`)
		await queryClient.invalidateQueries({
			queryKey: [...GROUPS_KEY, slug, groupSelected || 'all-groups'],
		})
		setMessage({
			message: 'Grupo editado correctamente',
			type: 'success',
		})
	}

	const handleDeleteGroup = (id: string) => {
		console.log(`Eliminando grupo ${id}`)
		push(pathname)
	}

	useEffect(() => {
		if (groups) {
			const sections: React.JSX.Element[] = []
			for (let i = 0; i < groups.length; i += 2) {
				const firstElement: Group = groups[i]
				const secondElement: Group = groups[i + 1]

				if (firstElement) {
					sections.push(
						<div className="flex flex-col xl:flex-row flex-wrap gap-2 w-full items-stretch">
							{composeGroupArticle(
								firstElement,
								() => handleEditGroup(firstElement.id),
								() => handleDeleteGroup(firstElement.id),
							)}
							{secondElement &&
								composeGroupArticle(
									secondElement,
									() => handleEditGroup(firstElement.id),
									() => handleDeleteGroup(firstElement.id),
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
					<Label className="text-2xl uppercase">No hay grupos</Label>
					<AddGroupButtom />
				</section>
			)}
		</>
	)
}
