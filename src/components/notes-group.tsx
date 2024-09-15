import useDebounce from '@/app/hooks/use-debounce'
import { getNoteGroup, updateNoteGroup } from '@/app/services/note-service'
import queryGetData from '@/app/services/query-request'
import { NOTE_KEY } from '@/lib/constants'
import { ChangeEvent, useEffect, useState } from 'react'
import { AutosizeTextarea } from './ui/autosize-textarea'
import { Label } from './ui/label'

interface Props {
	groupId: string
}

const NotesGroup = ({ groupId }: Props) => {
	const [text, setText] = useState('')

	const { data: note, isLoading } = queryGetData<string>(
		[
			NOTE_KEY,
			{
				group: groupId,
			},
		],
		() => getNoteGroup(groupId),
		groupId ? true : false,
	)

	useEffect(() => {
		if (note) setText(note)
	}, [note])

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value)
	}

	const updateNote = async (newNote: string) => {
		try {
			await updateNoteGroup(groupId, newNote)
		} catch (error) {
			console.log(error)
		}
	}

	useDebounce(() => updateNote(text), 500, [text])

	return (
		<section className="flex flex-col gap-3 w-full px-2 mt-2">
			<div className="flex flex-col gap-[4px] w-full">
				<Label className="text-md text-gray-400">Notas</Label>
			</div>
			<div>
				<AutosizeTextarea
					className="w-full"
					value={text}
					onChange={handleChange}
					disabled={isLoading}
					maxHeight={100}
				/>
			</div>
		</section>
	)
}
export default NotesGroup
