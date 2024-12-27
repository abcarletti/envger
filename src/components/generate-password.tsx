'use client'

import usePasswordGenerator from '@/hooks/use-password-generator'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
	ArrowUp,
	ChevronDown,
	ChevronRight,
	Copy,
	RefreshCcw,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { Slider } from './ui/slider'

interface PasswordGeneratorProps {
	onUsePassword?: (password: string) => void
}

export const GeneratePassword = ({ onUsePassword }: PasswordGeneratorProps) => {
	const { setMessage } = useToast()
	const { password, strength, feedback, generatePassword } =
		usePasswordGenerator()
	const [uppercase, setUppercase] = useState(true)
	const [lowercase, setLowercase] = useState(true)
	const [numbers, setNumbers] = useState(true)
	const [symbols, setSymbols] = useState(true)
	const [passwordLength, setPasswordLength] = useState(12)

	const [showGeneratePassword, setShowGeneratePassword] = useState(false)

	const onPasswordGenerate = () => {
		generatePassword(passwordLength, { uppercase, lowercase, numbers, symbols })
	}

	useEffect(() => {
		generatePassword(passwordLength, { uppercase, lowercase, numbers, symbols })
	}, [
		showGeneratePassword,
		uppercase,
		lowercase,
		numbers,
		symbols,
		passwordLength,
	])

	return (
		<fieldset
			className={cn('flex flex-col gap-2', {
				'': !showGeneratePassword,
				'border rounded-lg p-4 border-primary/60': showGeneratePassword,
			})}
		>
			<legend className="flex items-center gap-2 text-xs">
				<Button
					variant={'ghost'}
					size={'sm'}
					type="button"
					onClick={() => setShowGeneratePassword(!showGeneratePassword)}
				>
					{showGeneratePassword ? (
						<ChevronDown className="size-4" />
					) : (
						<ChevronRight className="size-4" />
					)}
					Generar contraseña
				</Button>
			</legend>
			<div
				className={cn('transition-all duration-200 ease-linear', {
					block: showGeneratePassword,
					hidden: !showGeneratePassword,
				})}
			>
				<div className="flex items-center gap-2">
					<Label className="text-xs">Longitud</Label>
					<Slider
						defaultValue={[passwordLength]}
						max={50}
						step={1}
						onValueChange={(value) => {
							setPasswordLength(value[0])
						}}
					/>
					<Label className="text-xs">{passwordLength}</Label>
				</div>
				<div className="flex gap-2 flex-grow justify-between my-4">
					<div className="flex gap-2 items-center">
						<Checkbox
							id="uppercase"
							name="uppercase"
							checked={uppercase}
							onCheckedChange={() => setUppercase(!uppercase)}
						/>
						<label
							htmlFor="uppercase"
							className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Mayúsculas
						</label>
					</div>
					<div className="flex gap-2 items-center">
						<Checkbox
							id="lowercase"
							name="lowercase"
							checked={lowercase}
							onCheckedChange={() => setLowercase(!lowercase)}
						/>
						<label
							htmlFor="lowercase"
							className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Minúsculas
						</label>
					</div>
					<div className="flex gap-2 items-center">
						<Checkbox
							id="numbers"
							name="numbers"
							checked={numbers}
							onCheckedChange={() => setNumbers(!numbers)}
						/>
						<label
							htmlFor="numbers"
							className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Números
						</label>
					</div>
					<div className="flex gap-2 items-center">
						<Checkbox
							id="symbols"
							name="symbols"
							checked={symbols}
							onCheckedChange={() => setSymbols(!symbols)}
						/>
						<label
							htmlFor="symbols"
							className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Símbolos
						</label>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="text-xs">Contraseña generada</Label>
					<div className="flex items-center gap-2">
						<Input value={password} readOnly className="text-xs w-full h-8" />
						<Button
							variant={'outline'}
							size={'icon-sm'}
							className="!h-7 !min-w-7"
							type="button"
							onClick={onPasswordGenerate}
						>
							<RefreshCcw className="size-3" />
						</Button>
						<Button
							variant={'outline'}
							size={'icon-sm'}
							className="!h-7 !min-w-7"
							type="button"
							onClick={() => {
								if (onUsePassword) {
									onUsePassword(password)
								}
							}}
							disabled={!password}
							title={
								password
									? 'Copiar contraseña'
									: 'No se ha generado ninguna contraseña'
							}
						>
							<ArrowUp className="size-3" />
						</Button>
						<Button
							variant={'outline'}
							size={'icon-sm'}
							className="!h-7 !min-w-7"
							type="button"
							onClick={() => {
								if (password) {
									setMessage({
										type: 'success',
										message:
											'Se ha copiado la contraseña generada al portapapeles',
									})
									navigator.clipboard.writeText(password)
								}
							}}
							disabled={!password}
							title={
								password
									? 'Copiar contraseña'
									: 'No se ha generado ninguna contraseña'
							}
						>
							<Copy className="size-3" />
						</Button>
					</div>
					<Progress
						value={(strength / 4) * 100 || 5}
						className={cn(
							'h-1 w-full',
							strength < 2
								? 'bg-red-500'
								: strength < 3
									? 'bg-orange-400'
									: strength < 4
										? 'bg-yellow-500'
										: 'bg-primary',
						)}
					/>
					<Label className="text-xs">{feedback}</Label>
				</div>
			</div>
		</fieldset>
	)
}
