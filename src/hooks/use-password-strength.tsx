'use client'

import { useEffect, useState } from 'react'
import zxcvbn from 'zxcvbn'

const usePasswordStrength = () => {
	const [password, setPassword] = useState('')
	const [strength, setStrength] = useState(0)
	const [feedback, setFeedback] = useState('')

	useEffect(() => {
		if (password) {
			const result = zxcvbn(password)
			setStrength(result.score)
			const feedbackMessages = [...result.feedback.suggestions]
			if (result.feedback.warning) {
				feedbackMessages.unshift(result.feedback.warning)
			}
			setFeedback(feedbackMessages.join(' '))
		} else {
			setStrength(0)
			setFeedback('')
		}
	}, [password])

	return { setPassword, strength, feedback }
}

export default usePasswordStrength
