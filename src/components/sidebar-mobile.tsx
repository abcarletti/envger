'use client'

import { Home, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

const SidebarMobile = () => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<Sheet open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="shrink-0 md:hidden">
					<Menu className="size-5" />
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="flex flex-col">
				<nav className="grid gap-2 text-lg font-medium">
					<SheetTrigger asChild>
						<Link
							href="/dashboard"
							className="flex items-center gap-2 text-lg font-semibold"
						>
							<h1 className="px-2 text-secondary-foreground text-xl font-bold">
								<span className="text-primary"> {'<'} </span>
								GuardNotes
								<span className="text-primary"> {'/>'} </span>
							</h1>
						</Link>
					</SheetTrigger>
					<Link
						href="#"
						className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
					>
						<Home className="size-5" />
						Dashboard
					</Link>
				</nav>
			</SheetContent>
		</Sheet>
	)
}

export default SidebarMobile
