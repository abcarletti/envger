import AvatarStatus from '@/components/avatar-status'
import CreateProjectButton from '@/components/create-project-buttom'
import LogoButtom from '@/components/logo-buttom'
import ProjectSelector from '@/components/project-selector'
import { SidebarDesktop } from '@/components/sidebar-desktop'
import { Suspense } from 'react'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-screen max-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden">
			<SidebarDesktop />
			<div className="flex flex-col flex-1">
				<header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
					<LogoButtom />
					{/* <SidebarMobile /> */}
					<div className="flex w-full flex-1 gap-4 items-center">
						<Suspense fallback={<div>Loading...</div>}>
							<ProjectSelector />
						</Suspense>
						<CreateProjectButton />
					</div>
					<AvatarStatus />
				</header>
				<main className="flex flex-1 overflow-hidden p-3">{children}</main>
			</div>
		</div>
	)
}
