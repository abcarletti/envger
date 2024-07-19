import { createStore } from 'zustand/vanilla'

export type ProjectState = {
	slug: string | undefined
}

export type ProjectActions = {
	updateSlugContext: (slug: string | undefined) => void
}

export type ProjectStore = ProjectState & ProjectActions

export const initProjectStore = (): ProjectState => {
	return {
		slug: undefined,
	}
}

export const defaultInitState: ProjectState = {
	slug: undefined,
}

export const createProjectStore = (
	initState: ProjectState = defaultInitState,
) => {
	return createStore<ProjectStore>()((set) => ({
		...initState,
		updateSlugContext: (slug: string | undefined) => set(() => ({ slug })),
	}))
}
