import { NavUser } from '@/components/sidebar/nav-user'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar'
import * as React from 'react'
import { ProjectSwitcher } from './project-switcher'
import { SidebarMainContent } from './sidebar-main-content'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<ProjectSwitcher />
			</SidebarHeader>
			<SidebarContent className="my-6">
				<React.Suspense>
					<SidebarMainContent />
				</React.Suspense>
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
