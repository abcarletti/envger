'use server'

import prisma from '@/clients/prisma'
import { registerSchema } from '@/schemas/register'
import { Provider, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const createUser = async (data: z.infer<typeof registerSchema>) => {
	return await prisma.user.create({
		data: {
			role: Role.USER,
			provider: Provider.CREDENTIALS,
			username: data.email,
			password: await bcrypt.hash(data.password, 10),
			completeName: data.name,
			email: data.email,
		},
	})
}
