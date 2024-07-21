import { GroupForm } from '@/forms/group-form'
import KVForm from '@/forms/kv-form'
import UrlForm from '@/forms/url-form'
import { Group } from '@prisma/client'
import { Settings } from 'lucide-react'
import { Suspense, useState } from 'react'
import DialogForm from './form-dialog'
import KvGroup from './kv-group'
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
	const [openUrlDialog, setOpenUrlDialog] = useState(false)
	const [openKVDialog, setOpenKVDialog] = useState(false)
	const { name, description } = group

	const closeDialog = () => {
		setDialogOpen(false)
		handleEditGroup()
	}

	return (
		<article className="flex flex-col flex-1 items-center min-h-24 bg-muted/30 border-[1px] border-muted rounded-lg py-2 max-w-group">
			<div className="flex flex-1 w-full justify-between px-4">
				<div className="flex flex-col gap-[4px] w-full">
					<Label className="text-xl">{name}</Label>
					{description && (
						<Label className="text-sm text-gray-400">{description}</Label>
					)}
					<Separator className="flex bg-primary w-2/12" />
				</div>
				<div className="">
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center focus:outline-none mt-2">
								<Settings className="size-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem className="p-0">
									<DialogTrigger className="w-full" asChild>
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
								<DialogTitle>Editar grupo: {group.name}</DialogTitle>
								<DialogDescription>
									Modifica los valores del grupo
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
				<KvGroup groupId={group.id} />
			</Suspense>
			<footer className="flex justify-end gap-2 pt-4 text-primary">
				<DialogForm
					triggerText="Añadir URL"
					title={`Crear URL del grupo: ${group.name}`}
					className={buttonVariants({
						size: 'sm',
						variant: 'outline',
					})}
					isDialogOpen={openUrlDialog}
					handleDialogOpen={setOpenUrlDialog}
				>
					<UrlForm
						groupId={group.id}
						closeDialog={() => setOpenUrlDialog(false)}
					/>
				</DialogForm>
				<DialogForm
					triggerText="Añadir credenciales"
					title={`Crear credenciales del grupo: ${group.name}`}
					className={buttonVariants({
						size: 'sm',
						variant: 'outline',
					})}
					isDialogOpen={openKVDialog}
					handleDialogOpen={setOpenKVDialog}
				>
					<KVForm
						groupId={group.id}
						closeDialog={() => setOpenKVDialog(false)}
					/>
				</DialogForm>
			</footer>
		</article>
	)
}
