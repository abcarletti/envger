'use client'

import RichTextEditor from '@/components/richtext/rich-text'
import { NOTE_PROJECT_KEY } from '@/lib/constants'
import { useProjectStore } from '@/providers/project-store-provider'
import { getNoteProject } from '@/services/note-service'
import queryGetData from '@/services/query-request'

const NotasPage = () => {
	const { project } = useProjectStore((store) => store)
	const { data: note, isLoading } = queryGetData<any>(
		[
			NOTE_PROJECT_KEY,
			{
				project: project?.id,
			},
		],
		() => getNoteProject(project?.id),
		project ? true : false,
	)

	return <>{!isLoading && <RichTextEditor initialProjectNote={note} />}</>
}

export default NotasPage
