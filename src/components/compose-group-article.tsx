import CredentialsForm from '@/forms/credentials-form'
import { GroupForm } from '@/forms/group-form'
import UrlForm from '@/forms/url-form'
import { Group } from '@prisma/client'
import { Settings } from 'lucide-react'
import { Suspense, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import ConfirmDialog from './confirm-dialog'
import CredentialsGroup from './credentials-group'
import NotesGroup from './notes-group'
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
import { Separator } from './ui/separator'
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
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const { name, description } = group
	const [showNote, setShowNote] = useState(false)

	const closeDialog = () => {
		setDialogOpen(false)
		handleEditGroup()
	}

	return (
		<>
			<article className="flex flex-col flex-1 items-center min-h-24 bg-muted/30 border-[1px] border-muted rounded-lg py-2 xl:max-w-group min-h-max">
				<div className="flex w-full justify-between px-4">
					<div className="flex flex-col gap-[4px] w-full">
						<Label className="text-xl">{name}</Label>
						{description && (
							<Label className="text-sm text-gray-400">{description}</Label>
						)}
						<Separator className="flex bg-primary w-2/12" />
					</div>
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center focus:outline-none mt-2">
								<Settings className="size-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem className="p-0">
									<DialogTrigger className="w-full" asChild>
										<Button
											size={'sm'}
											variant={'ghost'}
											className="w-full justify-start"
										>
											Editar
										</Button>
									</DialogTrigger>
								</DropdownMenuItem>
								<DropdownMenuItem className="p-0">
									<Button
										size={'sm'}
										variant={'destructive'}
										className="w-full justify-start"
										onClick={() => setOpenDeleteDialog(true)}
									>
										Eliminar
									</Button>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Editar grupo: {group.name}</DialogTitle>
								<DialogDescription>
									Modifica los valores del grupo
								</DialogDescription>
							</DialogHeader>
							<GroupForm group={group} dialogOpen={closeDialog} />
						</DialogContent>
					</Dialog>
				</div>
				<div className="w-full flex flex-col p-2 pb-0 justify-start">
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
						<CredentialsGroup groupId={group.id} />
					</Suspense>
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
						<NotesGroup groupId={group.id} showNote={showNote} />
					</Suspense>
				</div>
				<footer className="flex gap-2 pt-4 text-primary justify-center items-end flex-1 w-full">
					<UrlForm
						groupId={group.id}
						triggerText={'Añadir URL'}
						title={`Crear URL del grupo: ${group.name}`}
						className={buttonVariants({
							size: 'sm',
							variant: 'outline',
						})}
					/>
					<CredentialsForm
						groupId={group.id}
						triggerText={'Añadir credenciales'}
						title={`Crear credenciales del grupo: ${group.name}`}
						className={buttonVariants({
							size: 'sm',
							variant: 'outline',
						})}
					/>
					<Button
						size={'sm'}
						variant={'outline'}
						onClick={() => setShowNote(!showNote)}
					>
						{showNote ? 'Ocultar notas' : 'Mostrar notas'}
					</Button>
				</footer>
			</article>
			<ConfirmDialog
				showTrigger={false}
				buttonContent={'Eliminar'}
				buttonStyle={twMerge(
					buttonVariants({
						size: 'sm',
						variant: 'destructive',
					}),
					'w-full',
				)}
				title={`¿Deseas eliminar el grupo ${group.name}?`}
				content={
					<>
						¿Estás seguro de que deseas eliminar el grupo{' '}
						<span className="uppercase text-primary">{group.name}</span> y toda
						la información relacionada? Si confirma no se podrá recuperar.
					</>
				}
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(!openDeleteDialog)}
				onConfirm={() => {
					handleDeleteGroup()
					setOpenDeleteDialog(false)
				}}
			/>
		</>
	)
}
