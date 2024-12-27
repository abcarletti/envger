'use client'

import CredentialsForm from '@/forms/credentials-form'
import { useToast } from '@/hooks/use-toast'
import { CREDENTIALS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { environments } from '@/models/environment'
import { queryClient } from '@/providers/tanstack-query'
import { deleteCredentials } from '@/services/credentials-service'
import { getCredentialsGroup } from '@/services/group-service'
import queryGetData from '@/services/query-request'
import { decrypt } from '@/utils/encryption'
import { Credentials } from '@prisma/client'
import { Eye, EyeOff, Pencil, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import zxcvbn from 'zxcvbn'
import ConfirmDialog from './confirm-dialog'
import DialogForm from './form-dialog'
import { Button, buttonVariants } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

interface CredentialResult extends Credentials {
	passwordStrength: number
}

const CredentialsGroup = ({ groupId }: { groupId: string }) => {
	const { setMessage } = useToast()
	const [showPassword, setShowPassword] = useState(false)
	const [credentialsList, setCredentialsList] = useState<
		CredentialResult[] | null
	>(null)
	const [openEditDialog, setOpenEditDialog] = useState(false)
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

	const { data, isLoading } = queryGetData<Credentials[]>(
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
					data?.map(async (credentials) => {
						const password = await decrypt(credentials.password)
						return {
							...credentials,
							password,
							passwordStrength: password ? zxcvbn(password).score : 0,
						}
					}),
				)
				setCredentialsList(decryptedData)
			}
		}

		decryptData()
	}, [data])

	const handleDeleteCredentials = async (credentialsId: string) => {
		try {
			await deleteCredentials(credentialsId)
			await queryClient.invalidateQueries({
				queryKey: [CREDENTIALS_KEY],
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
						hidden: !credentialsList || credentialsList.length === 0,
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
					credentialsList &&
					credentialsList?.map((credential) => (
						<section key={credential.id} className="flex w-full gap-2">
							<Select value={credential.environment} disabled>
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
							<div className="flex gap-2 w-full">
								<Input
									readOnly
									value={credential.username}
									className="justify-start h-7 pl-2 cursor-pointer"
									placeholder="Nombre"
									onClick={() => {
										setMessage({
											type: 'success',
											message: 'El usuario ha sido copiado al portapapeles',
										})
										navigator.clipboard.writeText(credential.username)
									}}
								/>
								<div className="flex flex-col gap-2 w-full">
									<Input
										readOnly
										value={credential.password}
										className="justify-start h-7 pl-2 cursor-pointer"
										placeholder="Contraseña"
										type={showPassword ? 'text' : 'password'}
										onClick={() => {
											setMessage({
												type: 'success',
												message:
													'La contraseña ha sido copiado al portapapeles',
											})
											navigator.clipboard.writeText(credential.password)
										}}
									/>
									<Progress
										value={(credential.passwordStrength / 4) * 100 || 5}
										className={cn(
											'h-[0.15rem] w-full',
											credential.passwordStrength < 2
												? 'bg-destructive'
												: credential.passwordStrength < 3
													? 'bg-orange-400'
													: 'bg-primary',
										)}
									/>
								</div>
								<DialogForm
									triggerText={<Pencil className="size-4" />}
									title={`Edición URL:`}
									className={twMerge(
										buttonVariants({
											size: 'icon',
											variant: 'outline',
										}),
										'h-7 min-w-7',
									)}
									isDialogOpen={openEditDialog}
									handleDialogOpen={setOpenEditDialog}
								>
									<CredentialsForm
										groupId={groupId}
										credentialsDetail={credential}
										closeDialog={async () => setOpenEditDialog(false)}
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
										'h-7 min-w-7',
									)}
									title={`Eliminar credenciales`}
									content="¿Estás seguro de que deseas eliminar estas credenciales?"
									open={openDeleteDialog}
									onClose={() => setOpenDeleteDialog(!openDeleteDialog)}
									onConfirm={() => {
										handleDeleteCredentials(credential.id)
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

export default CredentialsGroup
