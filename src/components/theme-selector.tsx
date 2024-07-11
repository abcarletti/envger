'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import {
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeSelector() {
	const { setTheme, theme } = useTheme()

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>Tema</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
					<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
						<DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="dark">Oscuro</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="system">
							Sistema
						</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	)
}
