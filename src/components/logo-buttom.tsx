import { cn } from '@/lib/utils'
import { Comfortaa } from 'next/font/google'
import Link from 'next/link'
import { Button } from './ui/button'

const titleFont = Comfortaa({
	weight: ['400', '700'],
	subsets: ['latin'],
})

const LogoButtom = () => {
	return (
		<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
			<Button variant={'ghost'} asChild>
				<Link
					href="/dashboard"
					className="flex items-center gap-2 font-semibold"
				>
					<h1
						className={cn(
							'px-2 text-secondary-foreground text-xl font-bold',
							titleFont.className,
						)}
					>
						<span className="text-primary text-2xl">{'<'}</span>
						SecretNotes
						<span className="text-primary"> {'/>'}</span>
					</h1>
				</Link>
			</Button>
		</div>
	)
}

export default LogoButtom
