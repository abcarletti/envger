import { toast } from 'sonner'

export const showToast = (
	message: string,
	type: 'success' | 'error' | 'warning' | 'info',
) => {
	switch (type) {
		case 'success':
			toast.success(message)
			break
		case 'error':
			toast.error(message)
			break
		case 'warning':
			toast.warning(message)
			break
		case 'info':
			toast.info(message)
			break
	}
}

export interface ToastData {
	message: string
	type: 'success' | 'error' | 'warning' | 'info'
}
