'use server'

import prisma from '@/clients/prisma'
import { auth } from '@/lib/auth'

export const deleteProject = async (projectId: string) => {
	const session = await auth()
	return prisma.project.delete({
		where: {
			id: projectId,
			userId: <string>session?.user.id,
		},
	})
}
