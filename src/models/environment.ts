export const environments = [
	{
		value: 'NONE',
		label: 'Común',
	},
	{
		value: 'LOCAL',
		label: 'Local',
	},
	{
		value: 'DEV',
		label: 'Desarrollo',
	},
	{
		value: 'PRE',
		label: 'Pre-producción',
	},
	{
		value: 'PRO',
		label: 'Producción',
	},
] as const

export const composeEnvironmentName = (environment: string) => {
	return environments.find((env) => env.value === environment)?.label
}
