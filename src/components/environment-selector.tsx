'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select'

interface EnvironmentSelectorProps {
	selectTrigger: React.ReactNode
	onValueChange: (value: string) => void
	defaultValue: string
}

export const EnvironmentSelector = ({
	onValueChange,
	defaultValue,
	selectTrigger,
}: EnvironmentSelectorProps) => {
	return (
		<Select onValueChange={onValueChange} defaultValue={defaultValue}>
			<SelectTrigger asChild>
				<>
					{selectTrigger}
					<SelectValue placeholder="Selecciona un entorno" />
				</>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="LOCAL">Local</SelectItem>
				<SelectItem value="DEV">Desarrollo</SelectItem>
				<SelectItem value="PRE">Pre-producción</SelectItem>
				<SelectItem value="PRO">Producción</SelectItem>
			</SelectContent>
		</Select>
	)
}
