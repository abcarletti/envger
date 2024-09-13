'use server'

import prisma from '@/clients/prisma'
import { auth } from '@/lib/auth'
import { getEnvType } from '@/lib/utils'
import { createKVSchema } from '@/schemas/kv'
import { encrypt } from '@/utils/encryption'
import { Env } from '@prisma/client'
import { z } from 'zod'

export const createOrUpdateCredentials = async (
	kvId: string | undefined,
	groupId: string,
	formData: z.infer<typeof createKVSchema>,
) => {
	const session = await auth()

	const environment: Env = getEnvType(formData.environment)

	const key = formData.key
	const value = await encrypt(formData.value)

	if (kvId) {
		return await prisma.kv.update({
			where: {
				id: kvId,
				group: {
					id: groupId,
					project: {
						userId: <string>session?.user.id,
					},
				},
			},
			data: {
				key,
				value,
				environment,
			},
		})
	} else {
		return await prisma.kv.create({
			data: {
				key,
				value,
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

export const deleteCredentials = async (kvId: string) => {
	return await prisma.kv.delete({
		where: {
			id: kvId,
		},
	})
}
