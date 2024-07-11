import { Label } from '@/components/ui/label'
import { auth } from '@/lib/auth'

export default async function DashboardPage() {
	const session = await auth()

	console.log('userId', session?.user.id)
	return (
		<div className="flex items-center justify-center flex-1">
			<Label className="text-primary text-2xl font-semibold">Proyectos</Label>
		</div>
	)
}
