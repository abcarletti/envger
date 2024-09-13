'use client'

import { useToast } from '@/app/hooks/use-toast'
import { getCredentialsGroup } from '@/app/services/group-service'
import { deleteCredentials } from '@/app/services/kv-service'
import queryGetData from '@/app/services/query-request'
import { CREDENTIALS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { queryClient } from '@/providers/tanstack-query'
import { decrypt } from '@/utils/encryption'
import { Kv } from '@prisma/client'
import { Eye, EyeOff, Pencil, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

const KvGroup = ({ groupId }: { groupId: string }) => {
	const { setMessage } = useToast()
	const [showPassword, setShowPassword] = useState(false)
	const [urls, setUrls] = useState<Kv[] | null>(null)

	const { data, isLoading } = queryGetData<Kv[]>(
		[
			CREDENTIALS_KEY,
			{
				group: groupId,
			},
		],
		() => getCredentialsGroup(groupId),
		groupId ? true : false,
	)

	useEffect(() => {
		const decryptData = async () => {
			if (data) {
				const decryptedData = await Promise.all(
					data.map(async (kv) => ({
						...kv,
						value: await decrypt(kv.value),
					})),
				)
				setUrls(decryptedData)
			}
		}

		if (data) decryptData()
	}, [data])

	const handleDeleteCredentials = async (kvId: string) => {
		try {
			await deleteCredentials(kvId)
			await queryClient.invalidateQueries({
				queryKey: [
					CREDENTIALS_KEY,
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
					className={cn('flex gap-3 mb-2', {
						hidden: !urls || urls.length === 0,
					})}
				>
					<Label className="text-md text-gray-400">Credenciales</Label>
					<Button
						variant={'outline'}
						size={'icon'}
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="h-7 min-w-9"
					>
						{showPassword ? (
							<EyeOff className="size-5" />
						) : (
							<Eye className="size-5" />
						)}
					</Button>
				</div>
				{!isLoading &&
					urls &&
					urls.map(({ id, key, value, environment }) => (
						<section key={id} className="flex w-full gap-2">
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
							<div className="flex gap-2 w-full">
								<Input
									readOnly
									value={key}
									className="justify-start h-7 pl-2 cursor-pointer"
									placeholder="Nombre"
									onClick={() => {
										setMessage({
											type: 'success',
											message: 'El texto ha sido copiado al portapapeles',
										})
										navigator.clipboard.writeText(key)
									}}
								/>
								<Input
									readOnly
									value={value}
									className="justify-start h-7 pl-2 cursor-pointer"
									placeholder="Contraseña"
									type={showPassword ? 'text' : 'password'}
									onClick={() => {
										setMessage({
											type: 'success',
											message: 'El texto ha sido copiado al portapapeles',
										})
										navigator.clipboard.writeText(value)
									}}
								/>
								<Button
									variant={'outline'}
									size={'icon'}
									className="h-7 min-w-9"
									onClick={() => console.log('editar')}
								>
									<Pencil className="size-4" />
								</Button>
								<Button
									variant={'destructive'}
									size={'icon'}
									className="h-7 min-w-8"
									onClick={() => handleDeleteCredentials(id)}
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

export default KvGroup
