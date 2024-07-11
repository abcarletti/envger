import { Label } from '@/components/ui/label'

export default async function ProjectPage({
	params: { slug },
}: {
	params: { slug: string }
}) {
	return (
		<div className="flex items-center justify-center flex-1">
			<Label className="text-primary text-2xl font-semibold">
				Proyecto - {slug}
			</Label>
		</div>
	)
}
