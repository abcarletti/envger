import { Button } from '@/components/ui/button'
import { Home, Menu } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import AvatarStatus from '@/components/avatar-status'
import CreateDashboardButton from '@/components/create-dashboard-buttom'
import ProjectSelector from '@/components/project-selector'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Suspense } from 'react'

import { cn } from '@/lib/utils'
import { Comfortaa } from 'next/font/google'

export const metadata: Metadata = {
	title: 'Guard notes - Dashboard',
}

const titleFont = Comfortaa({
	weight: ['400', '700'],
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="flex min-h-screen max-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden">
			<div className="hidden border-r bg-muted/40 md:block">
				<div className="flex h-full max-h-screen flex-col gap-2">
					<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
						<Link
							href="/dashboard"
							className="flex items-center gap-2 font-semibold"
						>
							<h1
								className={cn(
									'px-2 text-secondary-foreground text-xl font-bold',
									titleFont.className,
								)}
							>
								<span className="text-primary text-2xl">{'<'}</span>
								SecretNotes
								<span className="text-primary"> {'/>'}</span>
							</h1>
						</Link>
					</div>
					<div className="flex flex-col flex-1 px-2 pb-2 justify-between">
						<nav className="grid items-start px-2 text-sm font-medium">
							<Link
								href="#"
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
							>
								<Home className="h-4 w-4" />
								Dashboard
							</Link>
						</nav>
						<Button
							size={'sm'}
							className="w-full bg-primary text-primary-foreground"
						>
							Añadir grupo
						</Button>
					</div>
				</div>
			</div>
			<div className="flex flex-col flex-1">
				<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
						<CreateDashboardButton />
					</div>
					<AvatarStatus />
				</header>
				<main className="flex flex-1 overflow-hidden p-3">{children}</main>
			</div>
		</div>
	)
}
