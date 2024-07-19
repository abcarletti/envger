'use client'

import { GroupForm } from '@/forms/group-form'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/providers/project-store-provider'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'

const AddGroupButtom = () => {
	const [dialogOpen, setDialogOpen] = useState(false)
	const [showButton, setShowButton] = useState(false)
	const { project } = useProjectStore((store) => store)

	useEffect(() => {
		if (project?.slug) {
			setShowButton(true)
		} else {
			setShowButton(false)
		}
	}, [project])

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button
					size={'sm'}
					className={cn(
						'w-full bg-primary text-primary-foreground',
						showButton ? 'block' : 'hidden',
					)}
				>
					Añadir grupo
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Añadir grupo</DialogTitle>
					<DialogDescription>
						Añade un nuevo grupo al proyecto actual
					</DialogDescription>
				</DialogHeader>
				<GroupForm dialogOpen={setDialogOpen} />
			</DialogContent>
		</Dialog>
	)
}

export default AddGroupButtom
