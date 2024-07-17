import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getSlugByName(name: string) {
	if (!name) return ''
	name = name.trim().toLowerCase().replace(/\s+/g, '-')

	accents.forEach((accent) => {
		name = name.replace(accent.letters, accent.base)
	})

	name = name.replace(/[^a-zA-Z0-9-]/g, '')

	return `./${name}`
}

const accents = [
	{ base: 'a', letters: /[áàäâãåāą]/g },
	{ base: 'e', letters: /[éèëêēėę]/g },
	{ base: 'i', letters: /[íìïîįī]/g },
	{ base: 'o', letters: /[óòöôõøōő]/g },
	{ base: 'u', letters: /[úùüûūųů]/g },
	{ base: 'c', letters: /[çćč]/g },
	{ base: 'n', letters: /[ñń]/g },
]
