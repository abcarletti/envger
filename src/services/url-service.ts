'use server'

import prisma from '@/clients/prisma'
import { auth } from '@/lib/auth'
import { getEnvType } from '@/lib/utils'
import { createUrlSchema } from '@/schemas/url'
import { Env } from '@prisma/client'
import { z } from 'zod'

export const createOrUpdateUrl = async (
	urlId: string | undefined,
	groupId: string,
	formData: z.infer<typeof createUrlSchema>,
) => {
	const session = await auth()

	const environment: Env = getEnvType(formData.environment)

	if (urlId) {
		return await prisma.url.update({
			where: {
				id: urlId,
				group: {
					id: groupId,
					project: {
						userId: <string>session?.user.id,
					},
				},
			},
			data: {
				url: formData.url,
				environment,
			},
		})
	} else {
		return await prisma.url.create({
			data: {
				url: formData.url,
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

export const deleteUrl = async (urlId: string) => {
	return await prisma.url.delete({
		where: {
			id: urlId,
		},
	})
}
