'use client'

import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import RegisterCard from './register-card'
import Logo from '/public/logo.png'

export function RegisterForm() {
	const handleLoginError = (msg: string) => {
		toast.error(msg)
	}

	return (
		<div className="flex flex-col items-center min-h-dvh gap-10 pt-10 bg-secondary">
			<div className="flex flex-col items-center gap-4">
				<div className="rounded-full bg-cover overflow-hidden">
					<Image
						src={Logo}
						alt="Logo"
						width={80}
						height={80}
						className="scale-105"
					/>
				</div>
				<h1
					className={cn(
						'px-0 md:px-2 text-secondary-foreground text-4xl font-semibold',
					)}
				>
					<span className="text-primary">{'<'}</span>
					Envger
					<span className="text-primary"> {'/>'}</span>
				</h1>
			</div>
			<RegisterCard loginError={handleLoginError} />
		</div>
	)
}
