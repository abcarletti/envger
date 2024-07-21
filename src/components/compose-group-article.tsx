import { GroupForm } from '@/forms/group-form'
import KVForm from '@/forms/kv-form'
import { cn } from '@/lib/utils'
import { Group } from '@prisma/client'
import { Settings } from 'lucide-react'
import { Suspense, useState } from 'react'
import { Button, buttonVariants } from './ui/button'
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
import { Skeleton } from './ui/skeleton'
import UrlsGroup from './urls-group'

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
								<DropdownMenuItem className="p-0">
									<DialogTrigger className="w-full">
										<Button size={'sm'} variant={'ghost'} className="w-full">
											Editar
										</Button>
									</DialogTrigger>
								</DropdownMenuItem>
								<DropdownMenuItem className="p-0">
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
			<Suspense
				fallback={
					<div className="flex w-full p-2">
						<section className="flex w-full gap-2">
							<Skeleton className="h-8 min-w-44 bg-primary/40" />
							<div className="flex w-full">
								<Skeleton className="h-8 w-full bg-primary/40" />
							</div>
						</section>
					</div>
				}
			>
				<UrlsGroup groupId={group.id} />
			</Suspense>
			<footer className="flex justify-end gap-2 pt-4 text-primary">
				<Dialog>
					<DialogTrigger
						className={cn(
							buttonVariants({
								size: 'sm',
								variant: 'outline',
							}),
						)}
					>
						Añadir URL
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
				<Dialog>
					<DialogTrigger
						className={cn(
							buttonVariants({
								size: 'sm',
								variant: 'outline',
							}),
						)}
					>
						Añadir credenciales
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{`Crear credenciales del grupo: ${group.name}`}</DialogTitle>
						</DialogHeader>
						<KVForm />
					</DialogContent>
				</Dialog>
			</footer>
		</article>
	)
}
