import { CoffeeIcon } from 'lucide-react'

import { Avatar } from '@/components/ui/avatar'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import UserItem from './user-item'

export async function NavUser() {
	const session = await auth()

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						size="sm"
						className="bg-[#FD0]/80 hover:bg-[#FD0] dark:text-secondary"
					>
						<Link href="https://buymeacoffee.com/abcarletti" target="_blank">
							<Avatar className="flex items-center justify-center size-4 rounded-lg">
								<CoffeeIcon className="size-4" />
							</Avatar>
							<div className="grid flex-1 text-left text-xs leading-tight">
								<span className="truncate font-semibold">
									Invítame a un café
								</span>
							</div>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
				<UserItem
					completeName={session?.user.completeName || ''}
					email={session?.user.email || ''}
					image={session?.user.image || ''}
				/>
			</SidebarMenu>
		</>
	)
}
