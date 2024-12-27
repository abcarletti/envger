import { Label } from '@/components/ui/label'

const NotasPage = () => {
	return (
		<div className="flex flex-col gap-4 w-full flex-1">
			<Label className="text-lg">Notas</Label>
			<textarea
				className="w-full flex-1 p-2 text-sm border border-primary rounded-lg"
				draggable={false}
			></textarea>
		</div>
	)
}

export default NotasPage
