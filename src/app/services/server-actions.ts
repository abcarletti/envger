'use server'

import prisma from '@/clients/prisma'
import { auth, signIn } from '@/lib/auth'

export async function handleCredentialSignIn(formData: any) {
	'use server'
	await signIn('credentials', formData, {
		redirectTo: '/dashboard',
	})
}

export async function handleGitHubSignIn() {
	'use server'
	await signIn('github', {
		redirectTo: '/dashboard',
	})
}

export async function createProject(data: any) {
	const project = await prisma.project.create({
		data: {
			name: data.name,
			slug: data.slug,
			description: data.description,
			userId: data.userId,
			imageUrl: data.imageUrl,
			favorite: data.favorite,
		},
	})

	return project
}

export async function getSelectorProjects() {
	const session = await auth()
	const projects = await prisma.project.findMany({
		select: {
			id: true,
			name: true,
			slug: true,
		},
		where: {
			userId: session?.user.id,
		},
		orderBy: {
			name: 'asc',
		},
	})

	return projects
}
