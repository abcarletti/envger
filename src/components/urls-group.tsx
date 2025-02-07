'use client'

import UrlForm from '@/forms/url-form'
import { useToast } from '@/hooks/use-toast'
import { URLS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { composeEnvironmentName } from '@/models/environment'
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
import { Button, buttonVariants } from './ui/button'
import { Label } from './ui/label'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip'

const UrlsGroup = ({ groupId }: { groupId: string }) => {
	const { setMessage } = useToast()
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
				<Label
					className={cn('text-md text-gray-400 mb-1', {
						hidden: !urls || urls.length === 0,
					})}
				>
					URLs
				</Label>
				{!isLoading &&
					urls &&
					urls.map((url) => (
						<section key={`urls-${url.id}`} className="flex w-full gap-2">
							<Label className="min-w-[110px] pl-2 h-7 text-gray-300 items-center flex text-xs">
								{composeEnvironmentName(url.environment)}
							</Label>
							<div className="flex w-full gap-2 overflow-hidden">
								<Button
									variant={'outline'}
									asChild
									className="justify-start h-7 pl-2 w-full"
								>
									<Link
										href={url.url}
										target="_blank"
										className="flex gap-2 items-center bg-transparent overflow-clip pr-2"
									>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger
													className="max-w-[95%] w-full overflow-clip"
													asChild
												>
													<Label>{url.url}</Label>
												</TooltipTrigger>
												<TooltipContent>
													<p>{url.url}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>

										<div className="flex justify-end">
											<ExternalLink className="!size-3 justify-end" />
										</div>
									</Link>
								</Button>
							</div>
							<div className="flex gap-1">
								<UrlForm
									groupId={groupId}
									urlDetail={url}
									key={`url-dialog-${groupId}`}
									triggerText={<Pencil />}
									title={`Edición URL: ${url.environment} - ${url.url}`}
									className={twMerge(
										buttonVariants({
											size: 'icon-sm',
											variant: 'outline',
										}),
										'min-w-7',
									)}
								/>
								<ConfirmDialog
									showTrigger={true}
									buttonContent={<Trash />}
									buttonStyle={twMerge(
										buttonVariants({
											size: 'icon-sm',
											variant: 'destructive',
										}),
										'min-w-7',
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
