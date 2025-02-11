'use server'

import prisma from '@/clients/prisma'
import { auth } from '@/lib/auth'

export const getNoteGroup = async (groupId: string): Promise<string> => {
	const session = await auth()

	const noteEntity = await prisma.note.findFirst({
		where: {
			groupId,
			group: {
				project: {
					userId: session?.user.id,
				},
			},
		},
	})

	return noteEntity?.note || ''
}

export const updateNoteGroup = async (
	groupId: string,
	note: string,
): Promise<string> => {
	const noteEntity = await prisma.note.upsert({
		where: {
			groupId,
		},
		update: {
			note,
		},
		create: {
			note,
			group: {
				connect: {
					id: groupId,
				},
			},
		},
	})

	return noteEntity.note
}

export const updateNoteProject = async (
	projectId: string | undefined,
	note: any,
): Promise<void> => {
	if (!projectId || !note) return
	await prisma.projectNote.upsert({
		where: {
			projectId,
		},
		update: {
			note,
		},
		create: {
			note,
			project: {
				connect: {
					id: projectId,
				},
			},
		},
	})
}

export const getNoteProject = async (
	projectId: string | undefined,
): Promise<any> => {
	const session = await auth()

	const noteEntity = await prisma.projectNote.findFirst({
		where: {
			projectId,
			project: {
				userId: session?.user.id,
			},
		},
	})

	return noteEntity?.note
}
