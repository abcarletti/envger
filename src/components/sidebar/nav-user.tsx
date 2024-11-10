'use client'

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CoffeeIcon,
	CreditCard,
	LogOut,
	PanelLeftOpen,
	PanelRightOpen,
	Sparkles,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

export function NavUser() {
	const { isMobile, open, setOpen } = useSidebar()
	const { data: session } = useSession()

	return (
		<SidebarMenu>
			<SidebarMenuButton
				asChild
				size="lg"
				className="bg-[#FD0]/80 text-primary-foreground hover:bg-[#FD0] hover:text-primary-foreground"
			>
				<Link href="https://buymeacoffee.com/abcarletti" target="_blank">
					<Avatar className="flex items-center justify-center size-8 rounded-lg">
						<CoffeeIcon className="size-5" />
					</Avatar>
					<div className="grid flex-1 text-left text-xs leading-tight">
						<span className="truncate font-semibold">Invítame a un café</span>
					</div>
				</Link>
			</SidebarMenuButton>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={session?.user?.image || ''}
									alt={session?.user?.name || 'User avatar'}
								/>
								<AvatarFallback className="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-xs leading-tight">
								<span className="truncate font-semibold">
									{session?.user?.name}
								</span>
								<span className="truncate font-light text-[0.7rem]">
									{session?.user?.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-xs">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={session?.user?.image || ''}
										alt="User avatar"
									/>
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-xs leading-tight">
									<span className="truncate font-semibold">
										{session?.user?.name}
									</span>
									<span className="truncate text-[0.7rem] font-light">
										{session?.user?.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Button
								onClick={() => signOut()}
								size={'sm'}
								className="w-full text-sm font-semibold my-1"
							>
								<LogOut />
								Cerrar sesión
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
			<Separator className="hidden md:block my-2" />
			<SidebarMenuButton
				asChild
				size="sm"
				onClick={() => setOpen(!open)}
				className="hidden md:block bg-background text-background-foreground hover:bg-background/80 hover:text-background-foreground"
			>
				<div>
					<Avatar className="flex items-center justify-center size-4 rounded-lg">
						{open ? (
							<PanelRightOpen className="size-5" />
						) : (
							<PanelLeftOpen className="size-5" />
						)}
					</Avatar>
					<div className="grid flex-1 text-left text-xs leading-tight">
						<span className="truncate">Contraer</span>
					</div>
				</div>
			</SidebarMenuButton>
		</SidebarMenu>
	)
}
