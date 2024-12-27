import { Env } from '@prisma/client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getSlugByName(name: string) {
	return `./${normalizeText(name)}`
}

export const getTagByName = (name: string) => {
	return normalizeText(name)
}

const normalizeText = (text: string) => {
	if (!text) return ''
	text = text.trim().toLowerCase().replace(/\s+/g, '-')

	accents.forEach((accent) => {
		text = text.replace(accent.letters, accent.base)
	})

	text = text.replace(/[^a-zA-Z0-9-]/g, '')

	return text
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

export const getEnvType = (env: string): Env => {
	switch (env) {
		case 'NONE':
			return Env.NONE
		case 'LOCAL':
			return Env.LOCAL
		case 'DEV':
			return Env.DEV
		case 'PRE':
			return Env.PRE
		case 'PRO':
			return Env.PRO
		default:
			return Env.LOCAL
	}
}
