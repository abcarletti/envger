'use server'

import prisma from '@/clients/prisma'
import { auth } from '@/lib/auth'
import { Kv, Url } from '@prisma/client'

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

export const getCredentialsGroup = async (groupId: string): Promise<Kv[]> => {
	const session = await auth()

	return prisma.kv.findMany({
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
