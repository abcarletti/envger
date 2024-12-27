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
import { SidebarGroups } from './sidebar-groups'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<ProjectSwitcher />
			</SidebarHeader>
			<SidebarContent className="my-6">
				<SidebarGroups />
				{/* <NavMain items={data.navMain} />
				<NavProjects projects={data.projects} /> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
