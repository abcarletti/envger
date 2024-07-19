import queryGetData from '@/app/services/query-request'
import { getProjectGroupsBySlug } from '@/app/services/server-actions'
import { GROUPS_KEY } from '@/lib/constants'
import { Group } from '@prisma/client'
import { Settings } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddGroupButtom from './add-group-buttom'
import { Label } from './ui/label'

const composeGroupArticle = ({ name, description }: Group) => {
	return (
		<article className="flex flex-col flex-1 items-center min-h-24 border-2 border-gray-400 rounded-lg py-2 max-w-group">
			<div className="flex w-full items-start justify-between px-4">
				<div className="flex flex-col">
					<Label className="text-xl uppercase">{name}</Label>
					<Label className="text-sm text-gray-400">{description}</Label>
				</div>
				<Settings className="size-4 mt-2" />
			</div>
		</article>
	)
}

export const ProjectGroups = ({ slug }: { slug: string }) => {
	const [groupSelected, setGroupSelected] = useState<string | null>(null)
	const [groupsComposed, setGroupsComposed] = useState<React.JSX.Element[]>([])
	const searchParams = useSearchParams()

	const { data: groups, isLoading: isLoadingGroups } = queryGetData(
		[...GROUPS_KEY, slug, groupSelected || 'all-groups'],
		() => getProjectGroupsBySlug(slug, groupSelected),
	)

	useEffect(() => {
		if (groups) {
			const sections: React.JSX.Element[] = []
			for (let i = 0; i < groups.length; i += 2) {
				const firstElement: Group = groups[i]
				const secondElement: Group = groups[i + 1]

				if (firstElement) {
					sections.push(
						<div className="flex flex-col xl:flex-row flex-wrap gap-2 w-full items-stretch">
							{composeGroupArticle(firstElement)}
							{secondElement && composeGroupArticle(secondElement)}
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
