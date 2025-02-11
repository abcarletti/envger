import prisma from '@/clients/prisma'
import { Provider, Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import NextAuth, { DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import { signInSchema } from './zod'

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		GitHub,
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				username: {},
				password: {},
			},
			authorize: async (credentials: any) => {
				const { username, password } =
					await signInSchema.parseAsync(credentials)

				if (!username) {
					throw new Error('No username provided')
				}

				const user = await prisma.user.findFirst({
					where: {
						username,
					},
				})

				// logic to verify if user exists
				if (!user) {
					// No user found, so this is their first attempt to login
					// meaning this is also the place you could do registration
					throw new Error('User not found.')
				}

				// logic to verify if password is correct
				if (!password) {
					throw new Error('No password provided')
				}

				const isPasswordValid = await bcrypt.compare(
					<string>password || '',
					user.password || '',
				)

				if (!isPasswordValid) {
					throw new Error('Credenciales incorrectas')
				}

				// return user object with the their profile data
				return {
					id: user.id,
					role: user.role,
					username: user.username,
					completeName: <string>user.completeName,
					email: user.email,
					image: user.avatar,
				}
			},
		}),
	],
	pages: {
		signIn: '/login',
	},
	callbacks: {
		authorized: async ({ auth, request }: any) => {
			if (request.url.match(/\/dashboard\/*/)) {
				return !!auth
			}
			return true
		},
		jwt: async ({ token, user, account, profile, trigger }: any) => {
			if (trigger === 'signIn') {
				if (account?.provider === 'github') {
					let user = await prisma.user.findFirst({
						where: {
							username: <string>profile?.email,
						},
					})
					if (user && user.provider !== Provider.GITHUB) {
						// Si ya existe el usuario y no se creó con GitHub, lanza un error
						throw new Error(
							'Ya existe un usuario con este correo registrado con otro proveedor.',
						)
					}
					if (!user) {
						user = await prisma.user.create({
							data: {
								role: Role.USER,
								provider: Provider.GITHUB,
								username: <string>profile?.email,
								completeName: <string>profile?.name,
								email: <string>profile?.email,
								avatar: <string>profile?.image,
							},
						})
					}
					token.id = user.id
					token.avatar = profile?.avatar_url
					token.username = profile?.login
					token.completeName = user?.completeName
					token.email = profile?.email
					token.role = user.role
				} else {
					token.id = user?.id
					token.username = user?.username
					token.completeName = user?.completeName
					token.email = user?.email
					token.role = user?.role
				}
			}
			return token
		},
		session: async ({ session, token }: any) => {
			const auxSession = {
				...session,
				user: {
					...session.user,
					id: <string>token.id,
					role: token.role === Role.ADMIN ? Role.ADMIN : Role.USER,
					completeName: <string>token.completeName || '',
					email: token.email || '',
				},
			}
			return auxSession
		},
	},
})

declare module 'next-auth' {
	/**
	 * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/**
			 * By default, TypeScript merges new interface properties and overwrites existing ones.
			 * In this case, the default session user properties will be overwritten,
			 * with the new ones defined above. To keep the default session user properties,
			 * you need to add them back into the newly declared interface.
			 */
			role: Role
			completeName: string
		} & DefaultSession['user']
	}

	interface User {
		id?: string
		username?: string | null
		completeName?: string
		email?: string | null
		image?: string | null
		role?: Role
	}
}
