'use server'

import prisma from '@/clients/prisma'
import { auth, signIn } from '@/lib/auth'
import { createProjectGroupSchema } from '@/schemas/group'
import { createProyectSchema } from '@/schemas/project'
import { Group, Project } from '@prisma/client'
import { z } from 'zod'

export const handleCredentialSignIn = async (formData: any) => {
	await signIn('credentials', formData, {
		redirectTo: '/dashboard',
	})
}

export async function handleGitHubSignIn() {
	await signIn('github', {
		redirectTo: '/dashboard',
	})
}

export const createOrUpdateProject = async (
	data: z.infer<typeof createProyectSchema>,
	projectId?: string,
) => {
	const session = await auth()

	if (projectId) {
		return await prisma.project.update({
			where: {
				id: projectId,
				userId: <string>session?.user.id,
			},
			data: {
				name: data.name,
				slug: data.slug.replace('./', ''),
				description: data.description,
				// imageUrl: data.imageUrl,
			},
		})
	} else {
		return await prisma.project.create({
			data: {
				name: data.name,
				slug: data.slug.replace('./', ''),
				description: data.description,
				// imageUrl: data.imageUrl,
				userId: <string>session?.user.id,
			},
		})
	}
}

export const getSelectorProjects = async (): Promise<Project[]> => {
	const session = await auth()
	return prisma.project.findMany({
		where: {
			userId: session?.user.id,
		},
		orderBy: [
			{
				favorite: 'desc',
			},
			{
				name: 'asc',
			},
		],
	})
}

export const getProjectBySlug = async (
	slug: string,
): Promise<Project | null> => {
	const session = await auth()
	return prisma.project.findFirst({
		where: {
			userId: session?.user.id,
			slug,
		},
		orderBy: {
			name: 'asc',
		},
	})
}

export const getProjectGroupsBySlug = async (
	slug: string,
	tag: string | null,
): Promise<Group[]> => {
	const session = await auth()

	return await prisma.group.findMany({
		where: {
			tag: tag || undefined,
			project: {
				slug,
				userId: session?.user.id,
			},
		},
		orderBy: {
			name: 'asc',
		},
	})
}

export const setFavoriteProject = async (slug: string, favorite: boolean) => {
	const session = await auth()
	return await prisma.project.update({
		where: {
			slug_user_id: {
				slug,
				userId: <string>session?.user.id,
			},
		},
		data: {
			favorite,
		},
	})
}

export const createOrUpdateGroup = async (
	groupId: string,
	data: z.infer<typeof createProjectGroupSchema>,
	project: Project,
) => {
	const session = await auth()

	return await prisma.group.upsert({
		update: {
			name: data.name,
			description: data.description,
			tag: data.tag,
		},
		where: {
			id: groupId,
			project: {
				userId: <string>session?.user.id,
				slug: project.slug,
			},
		},
		create: {
			name: data.name,
			description: data.description,
			tag: data.tag,
			project: {
				connect: {
					slug_user_id: {
						userId: <string>session?.user.id,
						slug: project.slug,
					},
				},
			},
		},
	})
}

export const deleteGroup = async (groupId: string, projectId: string) => {
	const session = await auth()
	return await prisma.group.delete({
		where: {
			id: groupId,
			project: {
				id: projectId,
				userId: <string>session?.user.id,
			},
		},
	})
}
