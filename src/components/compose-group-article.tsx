import { GroupForm } from '@/forms/group-form'
import { Group } from '@prisma/client'
import { Settings } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Label } from './ui/label'

export default function GroupArticle({
	group,
	handleEditGroup,
	handleDeleteGroup,
}: {
	group: Group
	handleEditGroup: () => void
	handleDeleteGroup: () => void
}) {
	const [dialogOpen, setDialogOpen] = useState(false)
	const { name, description } = group

	const closeDialog = () => {
		setDialogOpen(false)
		handleEditGroup()
	}

	return (
		<article className="flex flex-col flex-1 items-center min-h-24 bg-muted/30 border-[1px] border-muted rounded-lg py-2 max-w-group">
			<div className="flex flex-1 w-full justify-between px-4">
				<div className="flex flex-col">
					<Label className="text-xl">{name}</Label>
					<Label className="text-sm text-gray-400">{description}</Label>
				</div>
				<div>
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center focus:outline-none mt-2">
								<Settings className="size-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem className="w-full">
									<DialogTrigger className="w-full">
										<Button size={'sm'} variant={'ghost'} className="w-full">
											Editar
										</Button>
									</DialogTrigger>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Button
										size={'sm'}
										variant={'destructive'}
										className="w-full"
										onClick={handleDeleteGroup}
									>
										Eliminar
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Añadir grupo</DialogTitle>
								<DialogDescription>
									Añade un nuevo grupo al proyecto actual
								</DialogDescription>
							</DialogHeader>
							<GroupForm group={group} dialogOpen={closeDialog} />
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<footer className="flex justify-end gap-2 pt-4 text-primary">
				<Button size={'sm'} variant={'outline'}>
					Añadir URL
				</Button>
				<Button size={'sm'} variant={'outline'}>
					Añadir credenciales
				</Button>
			</footer>
		</article>
	)
}
