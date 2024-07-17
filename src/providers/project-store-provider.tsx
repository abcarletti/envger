'use client'

import {
	createProjectStore,
	initProjectStore,
	type ProjectStore,
} from '@/stores/project-store'
import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

export type ProjectStoreApi = ReturnType<typeof createProjectStore>

export const ProjectStoreContext = createContext<ProjectStoreApi | undefined>(
	undefined,
)

export interface ProjectStoreProviderProps {
	children: ReactNode
}

export const ProjectStoreProvider = ({
	children,
}: ProjectStoreProviderProps) => {
	const storeRef = useRef<ProjectStoreApi>()

	if (!storeRef.current) {
		storeRef.current = createProjectStore(initProjectStore())
	}

	return (
		<ProjectStoreContext.Provider value={storeRef.current}>
			{children}
		</ProjectStoreContext.Provider>
	)
}

export const useProjectStore = <T,>(selector: (store: ProjectStore) => T) => {
	const projectStoreContext = useContext(ProjectStoreContext)
	if (!projectStoreContext) {
		throw new Error(
			'useProjectStore must be used within a ProjectStoreProvider',
		)
	}
	return useStore(projectStoreContext, selector)
}
