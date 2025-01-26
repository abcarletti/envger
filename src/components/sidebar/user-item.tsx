'use client'

import { ChevronsUpDown, LogOut, UserCircle } from 'lucide-react'

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

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { signOut } from 'next-auth/react'
import { ThemeSelector } from '../theme-selector'
import { Button } from '../ui/button'

interface UserItemProps {
	completeName: string
	email: string
	image: string
}

export default function UserItem({
	completeName,
	email,
	image,
}: UserItemProps) {
	return (
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuButton
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={image || ''}
								alt={completeName || 'User avatar'}
							/>
							<AvatarFallback className="rounded-lg">
								<UserCircle className="size-5" />
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-xs leading-tight">
							<span className="truncate font-semibold">{completeName}</span>
							<span className="truncate font-light text-[0.7rem]">{email}</span>
						</div>
						<ChevronsUpDown className="ml-auto size-4" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
					// side={isMobile ? 'bottom' : 'right'}
					align="end"
					sideOffset={4}
				>
					<DropdownMenuLabel className="p-0 font-normal">
						<div className="flex items-center gap-2 px-1 py-1.5 text-left text-xs">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={image || ''} alt="User avatar" />
								<AvatarFallback className="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-xs leading-tight">
								<span className="truncate font-semibold">{completeName}</span>
								<span className="truncate text-[0.7rem] font-light">
									{email}
								</span>
							</div>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<ThemeSelector />
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
	)
}
