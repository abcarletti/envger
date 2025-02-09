'use client'

import ProjectGroups from '@/components/project-groups'

export default function ProjectPage() {
	return (
		<div className="p-2 flex flex-1">
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
				<ProjectGroups />
			</div>
		</div>
	)
}
