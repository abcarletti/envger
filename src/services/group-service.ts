'use server'

import prisma from '@/clients/prisma'
import { auth } from '@/lib/auth'
import { Credentials, Url } from '@prisma/client'

export const getUrlsGroup = async (groupId: string): Promise<Url[]> => {
	const session = await auth()

	return prisma.url.findMany({
		where: {
			groupId,
			group: {
				project: {
					userId: session?.user.id,
				},
			},
		},
		orderBy: {
			environment: 'asc',
		},
	})
}

export const getCredentialsGroup = async (
	groupId: string,
): Promise<Credentials[]> => {
	const session = await auth()

	return prisma.credentials.findMany({
		where: {
			groupId,
			group: {
				project: {
					userId: session?.user.id,
				},
			},
		},
		orderBy: {
			environment: 'asc',
		},
	})
}
