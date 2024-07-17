import { createStore } from 'zustand/vanilla'

export type ProjectState = {
	slug: string
}

export type ProjectActions = {
	updateSlugContext: (slug: string) => void
}

export type ProjectStore = ProjectState & ProjectActions

export const initProjectStore = (): ProjectState => {
	return {
		slug: '',
	}
}

export const defaultInitState: ProjectState = {
	slug: '',
}

export const createProjectStore = (
	initState: ProjectState = defaultInitState,
) => {
	return createStore<ProjectStore>()((set) => ({
		...initState,
		updateSlugContext: (slug: string) => set(() => ({ slug })),
	}))
}
