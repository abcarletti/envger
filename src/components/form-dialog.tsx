import { cn } from '@/lib/utils'
import { ReactElement } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'

interface Props {
	triggerText: ReactElement | string
	className?: string
	title: string
	description?: string
	children: React.ReactNode
	isDialogOpen: boolean
	handleDialogOpen: (open: boolean) => void
}

const DialogForm = ({
	triggerText,
	children,
	title,
	className,
	description,
	isDialogOpen,
	handleDialogOpen,
}: Props) => {
	return (
		<Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
			<DialogTrigger className={cn(className)}>{triggerText}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}

export default DialogForm
