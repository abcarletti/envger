import { cn } from '@/lib/utils'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog'
import { Button } from './ui/button'

interface ConfirmDialogProps {
	buttonContent: string | React.ReactNode
	buttonStyle?: string
	title: string
	content: string | React.ReactNode
	open: boolean
	showTrigger: boolean
	onClose: () => void
	onConfirm: () => void
}

const ConfirmDialog = ({
	open,
	buttonContent,
	buttonStyle,
	title,
	content,
	showTrigger,
	onClose,
	onConfirm,
}: ConfirmDialogProps) => {
	return (
		<AlertDialog open={open} onOpenChange={onClose}>
			{showTrigger && (
				<AlertDialogTrigger className={cn(buttonStyle)}>
					{buttonContent}
				</AlertDialogTrigger>
			)}
			<AlertDialogContent className="max-w-3xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{content}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<Button onClick={onClose} variant="ghost">
						Cancelar
					</Button>
					<Button onClick={onConfirm} variant="default">
						Confirmar
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default ConfirmDialog
