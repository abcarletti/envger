'use client'

import { showToast, ToastData } from '@/lib/toast'
import { useEffect, useState } from 'react'

export const useToast = () => {
	const [message, setMessage] = useState<ToastData>()

	useEffect(() => {
		if (message) showToast(message?.message, message?.type)
	}, [message])

	return {
		setMessage,
	}
}
