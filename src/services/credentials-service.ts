'use server'

import prisma from '@/clients/prisma'
import { auth } from '@/lib/auth'
import { getEnvType } from '@/lib/utils'
import { createCredentialsSchema } from '@/schemas/credentials'
import { encrypt } from '@/utils/encryption'
import { Env } from '@prisma/client'
import { z } from 'zod'

export const createOrUpdateCredentials = async (
	credentialsId: string | undefined,
	groupId: string,
	formData: z.infer<typeof createCredentialsSchema>,
) => {
	const session = await auth()

	const environment: Env = getEnvType(formData.environment)

	const username = formData.username
	const password = await encrypt(formData.password)

	if (credentialsId) {
		return await prisma.credentials.update({
			where: {
				id: credentialsId,
				group: {
					id: groupId,
					project: {
						userId: <string>session?.user.id,
					},
				},
			},
			data: {
				username,
				password,
				environment,
			},
		})
	} else {
		return await prisma.credentials.create({
			data: {
				username,
				password,
				environment,
				group: {
					connect: {
						id: groupId,
						project: {
							userId: <string>session?.user.id,
						},
					},
				},
			},
		})
	}
}

export const deleteCredentials = async (credentialsId: string) => {
	return await prisma.credentials.delete({
		where: {
			id: credentialsId,
		},
	})
}
