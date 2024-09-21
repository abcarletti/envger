import { cn } from '@/lib/utils'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'

const LogoButtom = () => {
	return (
		<div className="flex h-14 items-center border-b px-0 md:px-4 lg:h-[60px] lg:px-6">
			<Button variant={'ghost'} className="p-2 hidden md:block" asChild>
				<Link
					href="/dashboard"
					className="flex items-center gap-2 font-semibold p-0 md:p-2"
				>
					<h1
						className={cn(
							'px-0 md:px-2 text-secondary-foreground text-xl font-semibold',
						)}
					>
						<span className="text-primary text-2xl">{'<'}</span>
						SecretNotes
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

export default LogoButtom
