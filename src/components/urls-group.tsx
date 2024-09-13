'use client'
import { useToast } from '@/app/hooks/use-toast'
import { getUrlsGroup } from '@/app/services/group-service'
import queryGetData from '@/app/services/query-request'
import { deleteUrl } from '@/app/services/url-service'
import { URLS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { queryClient } from '@/providers/tanstack-query'
import { Url } from '@prisma/client'
import { ExternalLink, Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
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
		<div className="flex w-full p-2 items-center justify-center mt-2">
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
					urls.map(({ id, url, environment }) => (
						<section key={`urls-${id}`} className="flex w-full gap-2">
							<Select defaultValue={environment} disabled>
								<SelectTrigger className="max-w-40 p-2 h-7 disabled:cursor-default">
									<SelectValue placeholder="Selecciona un entorno" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="LOCAL">Local</SelectItem>
									<SelectItem value="DEV">Desarrollo</SelectItem>
									<SelectItem value="PRE">Pre-producción</SelectItem>
									<SelectItem value="PRO">Producción</SelectItem>
								</SelectContent>
							</Select>
							<div className="flex w-full gap-2">
								<Button
									variant={'outline'}
									asChild
									className="justify-start h-7 pl-2"
								>
									<Link
										href={url}
										target="_blank"
										className="flex w-full gap-2 items-center bg-transparent"
									>
										{url}
										<ExternalLink className="size-3" />
									</Link>
								</Button>
								<Button
									variant={'outline'}
									size={'icon'}
									className="h-7 max-w-9"
									onClick={() => console.log('editar')}
								>
									<Pencil className="size-4" />
								</Button>
								<Button
									variant={'destructive'}
									size={'icon'}
									className="h-7 max-w-9"
									onClick={() => handleDeleteUrl(id)}
								>
									<Trash className="size-4" />
								</Button>
							</div>
						</section>
					))}
			</div>
		</div>
	)
}

export default UrlsGroup
