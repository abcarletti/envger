'use client'
import { useToast } from '@/app/hooks/use-toast'
import { getUrlsGroup } from '@/app/services/group-service'
import queryGetData from '@/app/services/query-request'
import { URLS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Url } from '@prisma/client'
import { ExternalLink } from 'lucide-react'
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

	return (
		<div className="flex w-full p-2 items-center justify-center mt-2">
			<div
				className={cn('flex flex-col -rotate-90', {
					hidden: !urls || urls.length === 0,
				})}
			>
				<Label className="text-xl">URLs</Label>
			</div>
			<div className="flex flex-col gap-2 w-full">
				{!isLoading &&
					urls &&
					urls.map(({ url, environment }) => (
						<section className="flex w-full gap-2">
							<Select defaultValue={environment} disabled>
								<SelectTrigger className="max-w-40 p-2 h-7">
									<SelectValue placeholder="Selecciona un entorno" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="LOCAL">Local</SelectItem>
									<SelectItem value="DEV">Desarrollo</SelectItem>
									<SelectItem value="PRE">Pre-producción</SelectItem>
									<SelectItem value="PRO">Producción</SelectItem>
								</SelectContent>
							</Select>
							<div className="flex w-full">
								<Button
									variant={'outline'}
									asChild
									className="justify-start h-7 pl-2"
								>
									<Link
										href={url}
										target="_blank"
										className="flex w-full gap-2 items-center"
									>
										{url}
										<ExternalLink className="size-3" />
									</Link>
								</Button>
							</div>
						</section>
					))}
			</div>
		</div>
	)
}

export default UrlsGroup
