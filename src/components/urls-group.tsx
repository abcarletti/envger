'use client'

import UrlForm from '@/forms/url-form'
import { useToast } from '@/hooks/use-toast'
import { URLS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { environments } from '@/models/environment'
import { queryClient } from '@/providers/tanstack-query'
import { getUrlsGroup } from '@/services/group-service'
import queryGetData from '@/services/query-request'
import { deleteUrl } from '@/services/url-service'
import { Url } from '@prisma/client'
import { ExternalLink, Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import ConfirmDialog from './confirm-dialog'
import DialogForm from './form-dialog'
import { Button, buttonVariants } from './ui/button'
import { Label } from './ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

const UrlsGroup = ({ groupId }: { groupId: string }) => {
	const { setMessage } = useToast()
	const [openEditDialog, setOpenEditDialog] = useState(false)
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

	const { data: urls, isLoading } = queryGetData<Url[]>(
		[
			URLS_KEY,
			{
				group: groupId,
			},
		],
		() => getUrlsGroup(groupId),
		groupId ? true : false,
	)

	const handleDeleteUrl = async (urlId: string) => {
		try {
			await deleteUrl(urlId)
			await queryClient.invalidateQueries({
				queryKey: [
					URLS_KEY,
					{
						group: groupId,
					},
				],
			})
			setMessage({
				type: 'success',
				message: 'URL eliminada correctamente',
			})
		} catch (error) {
			setMessage({
				type: 'error',
				message: 'Error al eliminar la URL',
			})
		}
	}

	return (
		<div className="flex w-full p-2 items-center justify-center mt-2 py-2">
			<div className="flex flex-col gap-2 w-full">
				<div
					className={cn('flex flex-col mb-2', {
						hidden: !urls || urls.length === 0,
					})}
				>
					<Label className="text-md text-gray-400">URLs</Label>
				</div>
				{!isLoading &&
					urls &&
					urls.map((url) => (
						<section
							key={`urls-${url.id}`}
							className="flex w-full gap-2 flex-col md:flex-row"
						>
							<Select defaultValue={url.environment} disabled>
								<SelectTrigger className="max-w-40 p-2 h-7 disabled:cursor-default">
									<SelectValue placeholder="Selecciona un entorno" />
								</SelectTrigger>
								<SelectContent>
									{environments.map(({ value, label }) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<div className="flex w-full gap-2">
								<Button
									variant={'outline'}
									asChild
									className="justify-start h-7 pl-2"
								>
									<Link
										href={url.url}
										target="_blank"
										className="flex w-full gap-2 items-center bg-transparent"
									>
										{url.url}
										<ExternalLink className="size-3" />
									</Link>
								</Button>
								<DialogForm
									triggerText={<Pencil className="size-4" />}
									title={`Edición URL: ${url.environment} - ${url.url}`}
									className={twMerge(
										buttonVariants({
											size: 'icon',
											variant: 'outline',
										}),
										'h-7 max-w-9',
									)}
									isDialogOpen={openEditDialog}
									handleDialogOpen={setOpenEditDialog}
								>
									<UrlForm
										groupId={groupId}
										urlDetail={url}
										closeDialog={() => setOpenEditDialog(false)}
									/>
								</DialogForm>
								<ConfirmDialog
									showTrigger={true}
									buttonContent={<Trash className="size-4" />}
									buttonStyle={twMerge(
										buttonVariants({
											size: 'icon',
											variant: 'destructive',
										}),
										'h-7 max-w-9',
									)}
									title={`Eliminar URL: ${url.environment} - ${url.url}`}
									content="¿Estás seguro de que deseas eliminar esta URL?"
									open={openDeleteDialog}
									onClose={() => setOpenDeleteDialog(!openDeleteDialog)}
									onConfirm={() => {
										handleDeleteUrl(url.id)
										setOpenDeleteDialog(false)
									}}
								/>
							</div>
						</section>
					))}
			</div>
		</div>
	)
}

export default UrlsGroup
