'use client'

import { useState } from 'react'
import zxcvbn from 'zxcvbn'

function getScoreMessage(score: number) {
	switch (score) {
		case 0:
			return 'La contraseña es muy débil. Es extremadamente fácil de adivinar.'
		case 1:
			return 'La contraseña es débil. Podría ser adivinada con facilidad.'
		case 2:
			return 'La contraseña es aceptable, pero podría ser más segura.'
		case 3:
			return 'La contraseña es buena. Es bastante segura.'
		case 4:
			return 'La contraseña es muy fuerte. Es difícil de adivinar.'
		default:
			return 'No se pudo evaluar la seguridad de la contraseña.'
	}
}

const usePasswordGenerator = () => {
	const [password, setPassword] = useState('')
	const [strength, setStrength] = useState(0)
	const [feedback, setFeedback] = useState('')

	const generatePassword = (
		length = 8,
		options: Record<string, boolean> = {
			uppercase: true,
			lowercase: true,
			numbers: true,
			symbols: false,
		},
	) => {
		const characterSets: Record<string, string> = {
			lowercase: 'abcdefghijklmnopqrstuvwxyz',
			uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			numbers: '0123456789',
			symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
		}

		let availableChars: string = ''
		let requiredChars: string = ''

		// Construir el conjunto de caracteres disponibles y asegurar al menos uno de cada tipo seleccionado
		Object.keys(options).forEach((option) => {
			if (options[option]) {
				availableChars += characterSets[option]
				requiredChars += getRandomChar(characterSets[option])
			}
		})

		if (!availableChars) {
			// Si no hay opciones seleccionadas, establece un conjunto por defecto
			availableChars = characterSets.lowercase
			requiredChars = getRandomChar(characterSets.lowercase)
		}

		// Generar el resto de la contraseña
		const remainingLength = length - requiredChars.length
		let passwordArray = requiredChars.split('')

		for (let i = 0; i < remainingLength; i++) {
			passwordArray.push(getRandomChar(availableChars))
		}

		// Mezclar la contraseña para evitar patrones predecibles
		passwordArray = shuffleArray(passwordArray)

		const newPassword = passwordArray.join('')
		setPassword(newPassword)

		// Calcula la fortaleza de la contraseña
		const result = zxcvbn(newPassword)
		setStrength(result.score)
		setFeedback(getScoreMessage(result.score))
	}

	// Función para obtener un carácter aleatorio de una cadena
	const getRandomChar = (charSet: string) => {
		const randomIndex = getSecureRandomNumber(charSet.length)
		return charSet.charAt(randomIndex)
	}

	// Generador de números aleatorios seguro
	const getSecureRandomNumber = (max: number) => {
		const randomBuffer = new Uint32Array(1)
		window.crypto.getRandomValues(randomBuffer)
		return randomBuffer[0] % max
	}

	// Función para mezclar un arreglo de forma aleatoria
	const shuffleArray = (array: string[]) => {
		const shuffledArray = array.slice()
		for (let i = shuffledArray.length - 1; i > 0; i--) {
			const j = getSecureRandomNumber(i + 1)
			;[shuffledArray[i], shuffledArray[j]] = [
				shuffledArray[j],
				shuffledArray[i],
			]
		}
		return shuffledArray
	}

	return { password, strength, feedback, generatePassword }
}

export default usePasswordGenerator
