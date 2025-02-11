'use client'

import CredentialsForm from '@/forms/credentials-form'
import { useToast } from '@/hooks/use-toast'
import { CREDENTIALS_KEY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { composeEnvironmentName } from '@/models/environment'
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
import { GroupSectionSkeleton } from './skeletons/group-section-skeleton'
import { Button, buttonVariants } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip'

interface CredentialResult extends Credentials {
	passwordStrength: number
}

const CredentialsGroup = ({ groupId }: { groupId: string }) => {
	const { setMessage } = useToast()
	const [showPassword, setShowPassword] = useState(false)
	const [credentialsList, setCredentialsList] = useState<
		CredentialResult[] | null
	>(null)
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const { data, isLoading: isLoadingData } = queryGetData<Credentials[]>(
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
				setIsLoading(false)
			}
		}

		if (data) {
			setIsLoading(true)
			decryptData()
		} else {
			setIsLoading(false)
		}
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
		<>
			{(isLoadingData || isLoading) && <GroupSectionSkeleton />}
			{!isLoadingData && !isLoading && (
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
								size={'icon-sm'}
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="min-w-7"
							>
								{showPassword ? (
									<EyeOff className="size-5" />
								) : (
									<Eye className="size-5" />
								)}
							</Button>
						</div>
						{credentialsList &&
							credentialsList?.map((credential) => (
								<section key={credential.id} className="flex w-full gap-2">
									<Label className="min-w-[110px] pl-2 h-7 text-gray-300 items-center flex text-xs">
										{composeEnvironmentName(credential.environment)}
									</Label>
									<div className="flex gap-2 w-full">
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Input
														readOnly
														value={credential.username}
														className="justify-start h-7 pl-2 cursor-pointer"
														placeholder="Nombre"
														onClick={() => {
															setMessage({
																type: 'success',
																message:
																	'El usuario ha sido copiado al portapapeles',
															})
															navigator.clipboard.writeText(credential.username)
														}}
													/>
												</TooltipTrigger>
												<TooltipContent>
													<p>{credential.username}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										<div className="relative w-full">
											<Input
												readOnly
												value={credential.password}
												className="justify-start h-7 pl-2 cursor-pointer rounded-b-sm"
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
											<div className="absolute bottom-0 left-0 right-0">
												<Progress
													value={(credential.passwordStrength / 4) * 100 || 5}
													className={cn(
														'h-[0.15rem] w-full rounded-b-3xl',
														credential.passwordStrength < 2
															? 'bg-destructive'
															: credential.passwordStrength < 3
																? 'bg-orange-400'
																: 'bg-primary',
													)}
												/>
											</div>
										</div>
										<CredentialsForm
											groupId={groupId}
											credentialsDetail={credential}
											triggerText={<Pencil />}
											title={`Edición URL:`}
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
			)}
		</>
	)
}

export default CredentialsGroup
