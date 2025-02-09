import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="flex flex-col h-screen">{children}</SidebarInset>
		</SidebarProvider>
	)
}
