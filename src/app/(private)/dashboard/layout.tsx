import { AppSidebar } from '@/components/sidebar/app-sidebar'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import Link from 'next/link'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex md:hidden h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Link href="/dashboard" className="font-semibold">
							<h1 className="px-0 text-secondary-foreground text-lg font-semibold items-center justify-center">
								<span className="text-primary text-xl">{'<'}</span>
								Envger
								<span className="text-primary"> {'/>'}</span>
							</h1>
						</Link>
					</div>
				</header>
				<main className="flex flex-1 overflow-hidden p-3">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	)
}
