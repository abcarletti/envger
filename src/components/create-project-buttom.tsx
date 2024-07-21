'use client'

import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Label } from './ui/label'

export default function CreateProjectButton() {
	return (
		<Button size="sm" className="flex gap-2 items-center p-2" asChild>
			<Link href="/dashboard/create">
				<PlusCircle className="size-4" />
				<Label className="hidden md:block text-xs">Nuevo proyecto</Label>
			</Link>
		</Button>
	)
}
