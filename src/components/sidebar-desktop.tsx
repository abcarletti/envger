'use client'

import { useProjectStore } from '@/providers/project-store-provider'
import LogoButtom from './logo-buttom'
import { SidebarGroupsNav } from './sidebar-nav'

export const SidebarDesktop = () => {
	const { slug } = useProjectStore((state) => state)

	const finalSlug = slug || ''

	return (
		<div className="hidden border-r bg-muted/40 md:block">
			<div className="flex h-full max-h-screen flex-col gap-2">
				<LogoButtom />
				<SidebarGroupsNav slug={finalSlug} />
			</div>
		</div>
	)
}
