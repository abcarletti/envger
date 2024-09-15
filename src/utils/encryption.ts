'use server'
import * as crypto from 'crypto'

// Configuración
const algorithm = 'aes-256-gcm'
const key = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex') // Clave de 256 bits (64 caracteres hexadecimales)

// Función para encriptar
export async function encrypt(text: string): Promise<string> {
	if (!text) return ''
	const iv = crypto.randomBytes(12)
	const cipher = crypto.createCipheriv(algorithm, key, iv)
	const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
	const authTag = cipher.getAuthTag()
	const encryptedBuffer = Buffer.concat([iv, authTag, encrypted])
	return encryptedBuffer.toString('base64')
}

// Función para desencriptar
export const decrypt = async (encrypted: string) => {
	if (!encrypted) return ''
	const encryptedBuffer = Buffer.from(encrypted, 'base64')
	const iv = encryptedBuffer.subarray(0, 12)
	const authTag = encryptedBuffer.subarray(12, 28)
	const encryptedData = encryptedBuffer.subarray(28)
	const decipher = crypto.createDecipheriv(algorithm, key, iv)
	decipher.setAuthTag(authTag)
	const decrypted = Buffer.concat([
		decipher.update(encryptedData),
		decipher.final(),
	])
	return decrypted.toString('utf8')
}
