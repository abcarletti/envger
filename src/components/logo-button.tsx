import { Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

const LogoButton = () => {
	return (
		<div className="flex h-14 items-center border-b px-0 lg:h-[60px] lg:px-6">
			<Button
				variant={'ghost'}
				className="hidden md:flex items-center justify-center hover:background-none"
				asChild
			>
				<Link
					href="/dashboard"
					className="flex items-center justify-center font-semibold p-0"
				>
					<h1 className="px-0 text-secondary-foreground text-xl font-semibold items-center justify-center">
						<span className="text-primary text-2xl">{'<'}</span>
						Envger
						<span className="text-primary"> {'/>'}</span>
					</h1>
				</Link>
			</Button>
			<Button variant={'outline'} className="p-2 block md:hidden" asChild>
				<Link
					href="/dashboard"
					className="flex items-center gap-2 font-semibold p-0 md:p-2"
				>
					<Home className="size-5" />
				</Link>
			</Button>
		</div>
	)
}

export default LogoButton
