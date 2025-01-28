import useDebounce from '@/hooks/use-debounce'
import { NOTE_KEY } from '@/lib/constants'
import { getNoteGroup, updateNoteGroup } from '@/services/note-service'
import queryGetData from '@/services/query-request'
import { ChangeEvent, useEffect, useState } from 'react'
import { AutoSizeTextarea } from './ui/auto-size-textarea'
import { Label } from './ui/label'

interface Props {
	groupId: string
	showNote: boolean
}

const NotesGroup = ({ groupId, showNote }: Props) => {
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
			console.error(error)
		}
	}

	useDebounce(() => updateNote(text), 500, [text])

	return (
		<>
			{text || showNote ? (
				<section className="flex flex-col gap-3 w-full px-2 mt-2">
					<div className="flex flex-col gap-[4px] w-full">
						<Label className="text-md text-gray-400">Notas</Label>
					</div>
					<div>
						<AutoSizeTextarea
							className="w-full"
							value={text}
							onChange={handleChange}
							disabled={isLoading}
							maxHeight={100}
						/>
					</div>
				</section>
			) : null}
		</>
	)
}
export default NotesGroup
