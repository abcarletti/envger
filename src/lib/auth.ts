import prisma from '@/clients/prisma'
import { Provider } from '@prisma/client'
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
			authorize: async (credentials) => {
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
					throw new Error('Credenciales incorretas')
				}

				// return user object with the their profile data
				return {
					id: user.id,
					username: user.username,
					name: user.completeName,
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
		authorized: async ({ auth, request }) => {
			if (request.url.match(/\/dashboard\/*/)) {
				return !!auth
			}
			return true
		},
		jwt: async ({ token, user, account, profile, trigger }) => {
			if (trigger === 'signIn') {
				if (account?.provider === 'github') {
					let user = await prisma.user.findFirst({
						where: {
							provider: Provider.GITHUB,
							username: <string>profile?.login,
						},
					})
					if (!user) {
						user = await prisma.user.create({
							data: {
								provider: Provider.GITHUB,
								username: <string>profile?.login,
								completeName: <string>profile?.name,
								email: <string>profile?.email,
								avatar: <string>profile?.avatar_url,
							},
						})
					}
					token.id = user.id
					token.avatar = profile?.avatar_url
					token.username = profile?.login
					token.name = profile?.name
					token.email = profile?.email
				} else {
					token.id = user?.id
					token.username = user?.username
					token.name = user?.username
					token.email = user?.email
				}
			}
			return token
		},
		session: async ({ session, token }) => {
			session.user.id = <string>token.id
			session.user.name = token.name
			session.user.email = token.email || ''
			return session
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
		} & DefaultSession['user']
	}

	interface User {
		id?: string
		username?: string | null
		name?: string | null
		email?: string | null
		image?: string | null
	}
}
