'use client'

import { toast } from 'sonner'
import LoginCard from './login-card'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Logo from '/public/logo.png'

export function LoginForm() {
	const handleLoginError = (msg: string) => {
		toast.error(msg)
	}

	return (
		<section className="flex flex-col items-center h-screen gap-10 pt-10">
			<div className="flex flex-col items-center gap-4">
				<div className="rounded-full bg-cover overflow-hidden">
					<Image
						src={Logo}
						alt="Logo"
						width={100}
						height={100}
						className="scale-105"
					/>
				</div>
				<h1
					className={cn(
						'px-0 md:px-2 text-secondary-foreground text-3xl font-semibold',
					)}
				>
					<span className="text-primary text-3xl">{'<'}</span>
					Envger
					<span className="text-primary"> {'/>'}</span>
				</h1>
			</div>
			<LoginCard loginError={handleLoginError} />
		</section>
	)
}
