'use client'

import { useEffect } from 'react'

function useDebounce(callback: () => void, delay: number, dependencies: any[]) {
	useEffect(() => {
		const handler = setTimeout(() => {
			callback()
		}, delay)

		// Limpiar el timeout si las dependencias cambian o el componente se desmonta
		return () => {
			clearTimeout(handler)
		}
	}, [...(dependencies || []), delay])
}

export default useDebounce
