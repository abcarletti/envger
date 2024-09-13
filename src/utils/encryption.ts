'use server'
import * as crypto from 'crypto'

// Configuración
const algorithm = 'aes-256-gcm'
const key = Buffer.from(process.env.ENCRYPTION_KEY as string, 'hex') // Clave de 256 bits (64 caracteres hexadecimales)

// Interfaz para los datos encriptados
interface EncryptedData {
	iv: string
	encryptedData: string
	authTag: string
}

// Función para encriptar
export async function encrypt(text: string): Promise<string> {
	if (!text) return ''
	const iv = crypto.randomBytes(12) // IV de 96 bits para AES-GCM
	const cipher = crypto.createCipheriv(algorithm, key, iv)
	let encrypted = cipher.update(text, 'utf8', 'hex')
	encrypted += cipher.final('hex')
	const authTag = cipher.getAuthTag() // Obtener el tag de autenticación
	return JSON.stringify({
		iv: iv.toString('hex'),
		encryptedData: encrypted,
		authTag: authTag.toString('hex'),
	})
}

// Función para desencriptar
export const decrypt = async (encrypted: string) => {
	if (!encrypted) return ''
	const encryptedData: EncryptedData = JSON.parse(encrypted)
	const iv = Buffer.from(encryptedData.iv, 'hex')
	const authTag = Buffer.from(encryptedData.authTag, 'hex')
	const decipher = crypto.createDecipheriv(algorithm, key, iv)
	decipher.setAuthTag(authTag)
	let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8')
	decrypted += decipher.final('utf8')
	return decrypted
}
