import AvatarStatus from '@/components/avatar-status'
import CreateProjectButton from '@/components/create-project-buttom'
import ProjectSelector from '@/components/project-selector'
import { SidebarDesktop } from '@/components/sidebar-desktop'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Home, Menu } from 'lucide-react'
import Link from 'next/link'
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
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="shrink-0 md:hidden"
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle navigation menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col">
							<nav className="grid gap-2 text-lg font-medium">
								<Link
									href="#"
									className="flex items-center gap-2 text-lg font-semibold"
								>
									<h1 className="px-2 text-secondary-foreground text-xl font-bold">
										<span className="text-primary"> {'<'} </span>
										GuardNotes
										<span className="text-primary"> {'/>'} </span>
									</h1>
								</Link>
								<Link
									href="#"
									className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
								>
									<Home className="h-5 w-5" />
									Dashboard
								</Link>
							</nav>
						</SheetContent>
					</Sheet>
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
