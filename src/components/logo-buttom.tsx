import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from './ui/button'

const LogoButtom = () => {
	return (
		<div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
			<Button variant={'ghost'} className="p-2" asChild>
				<Link
					href="/dashboard"
					className="flex items-center gap-2 font-semibold"
				>
					<h1
						className={cn(
							'px-2 text-secondary-foreground text-xl font-semibold',
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
