import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { auth } from '@/lib/auth'
import Image from 'next/image'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { ThemeSelector } from './theme-selector'
import { SignOut } from './signout-button'
import { CircleUser } from 'lucide-react'

export default async function AvatarStatus() {
	const session = await auth()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary" size="icon" className="rounded-full">
					{session?.user?.image ? (
						<Image
							className="rounded-full"
							src={session?.user?.image}
							width={40}
							height={40}
							alt="User avatar"
						/>
					) : (
						<CircleUser className="size-5" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel className="flex flex-col gap-1">
					<Label className="text-primary">{session?.user?.name}</Label>
					<Label className="text-xs font-thin text-slate-400">
						{session?.user?.email}
					</Label>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<ThemeSelector />
				<DropdownMenuSeparator />
				<DropdownMenu>
					<SignOut />
				</DropdownMenu>
				<DropdownMenuSeparator />
				<DropdownMenuLabel className="flex text-[0.6rem] font-thin justify-center items-center text-slate-400">
					Creado por @<span className="text-primary">abcarletti</span>
				</DropdownMenuLabel>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
