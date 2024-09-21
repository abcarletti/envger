'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SidebarGroupsNav } from './sidebar-nav'

export const SidebarDesktop = () => {
	const pathname = usePathname()
	const [loadGroups, setLoadGroups] = useState<boolean>(false)

	useEffect(() => {
		if (pathname) {
			const isDashboard = pathname === '/dashboard'
			const isCreate = pathname === '/dashboard/create'
			setLoadGroups(!isDashboard && !isCreate)
		}
	}, [pathname])

	return (
		<div className="border-r bg-background hidden md:block">
			<div className="flex h-full max-h-screen flex-col gap-2">
				{loadGroups && <SidebarGroupsNav />}
			</div>
		</div>
	)
}
