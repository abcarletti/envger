'use client'

import queryGetData from '@/app/services/query-request'
import { getProjectGroupsBySlug } from '@/app/services/server-actions'
import { GROUPS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Group } from '@prisma/client'
import { FolderCode, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddGroupButtom from './add-group-buttom'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Separator } from './ui/separator'

export const SidebarGroupsNav = ({ slug }: { slug: string }) => {
	const router = useRouter()
	const pathname = usePathname()
	const [groupSelected, setGroupSelected] = useState<string | null>(null)
	const searchParams = useSearchParams()

	const selectGroup = (tag: string) => {
		if (groupSelected === tag) {
			setGroupSelected(null)
			router.push(`${pathname}`)
			return
		} else {
			setGroupSelected(tag)
			const newParams = new URLSearchParams({ tag }) // Reemplaza 'newTagValue' con el valor deseado
			router.push(`${pathname}?${newParams.toString()}`)
		}
	}

	const { data: groups, isLoading: isLoadingGroups } = queryGetData(
		[...GROUPS_KEY, slug],
		() => getProjectGroupsBySlug(slug, null),
	)

	useEffect(() => {
		const tag = searchParams.get('tag')
		if (tag) {
			setGroupSelected(tag)
		}
	}, [searchParams])

	return (
		<div className="flex flex-col flex-1 px-2 pb-2 justify-between overflow-hidden">
			<div className="flex flex-col flex-1  overflow-y-auto">
				<Label className="text-sm text-muted-foreground">Grupos</Label>
				<Separator className="my-2" />
				<nav className="grid items-start px-2 mb-2 text-sm font-medium overflow-y-auto">
					{!isLoadingGroups &&
						groups &&
						groups.map((group: Group) => (
							<Button
								variant={'ghost'}
								className={cn(
									'flex justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
									group.tag === groupSelected
										? 'bg-primary/10 text-primary'
										: '',
								)}
								onClick={() => selectGroup(group.tag)}
							>
								<div className="flex justify-normal gap-3">
									<FolderCode className="size-4" />
									<Label>{group.name}</Label>
								</div>
								<X
									className={cn(
										'size-4',
										group.tag === groupSelected ? 'block' : 'hidden',
									)}
								/>
							</Button>
						))}
				</nav>
			</div>
			<AddGroupButtom />
		</div>
	)
}
