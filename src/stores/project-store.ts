import { getProjectBySlug } from '@/app/services/server-actions'
import { Project } from '@prisma/client'
import { createStore } from 'zustand/vanilla'

export type ProjectState = {
	project: Project | null
}

export type ProjectActions = {
	updateProjectContext: (project: Project | undefined) => void
	updateProjectContextBySlug: (slug: string | undefined) => void
}

export type ProjectStore = ProjectState & ProjectActions

export const initProjectStore = (): ProjectState => {
	return {
		project: null,
	}
}

export const defaultInitState: ProjectState = {
	project: null,
}

export const createProjectStore = (
	initState: ProjectState = defaultInitState,
) => {
	return createStore<ProjectStore>()((set) => ({
		...initState,
		updateProjectContext: (project: Project | undefined) =>
			set(() => ({ project })),
		updateProjectContextBySlug: async (slug: string | undefined) => {
			if (slug) {
				const project = await getProjectBySlug(slug)
				set({ project })
			} else {
				set({ project: undefined })
			}
		},
	}))
}
