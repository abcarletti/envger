import LogoButtom from './logo-buttom'
import { SidebarGroupsNav } from './sidebar-nav'

export const SidebarDesktop = () => {
	return (
		<div className="hidden border-r bg-background md:block">
			<div className="flex h-full max-h-screen flex-col gap-2">
				<LogoButtom />
				<SidebarGroupsNav />
			</div>
		</div>
	)
}
