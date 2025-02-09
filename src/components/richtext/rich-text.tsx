'use client'

import { Button } from '@/components/ui/button'
import useDebounce from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/providers/project-store-provider'
import { updateNoteProject } from '@/services/note-service'
import BulletList from '@tiptap/extension-bullet-list'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Highlighter,
	Italic,
	List,
	ListOrdered,
	Strikethrough,
	UnderlineIcon,
} from 'lucide-react'
import { useState } from 'react'

import './rich-text.css'

interface RichTextEditorProps {
	initialProjectNote: JSONContent
}

const RichTextEditor = ({ initialProjectNote }: RichTextEditorProps) => {
	const [projectNote, setProjectNote] =
		useState<JSONContent>(initialProjectNote)
	const { project } = useProjectStore((store) => store)

	const updateProjectNote = async (newProjectNote: JSONContent | undefined) => {
		try {
			await updateNoteProject(project?.id, newProjectNote)
		} catch (error) {
			console.error(error)
		}
	}

	useDebounce(() => updateProjectNote(projectNote), 600, [projectNote])

	const editor = useEditor({
		autofocus: true,
		extensions: [
			StarterKit,
			Underline,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			Highlight,
			ListItem,
			OrderedList,
			BulletList,
			CodeBlockLowlight.configure({
				lowlight: createLowlight(common),
				defaultLanguage: 'javascript',
				languageClassPrefix: 'language-',
			}),
			Document,
			Paragraph,
			Text,
			Heading.configure({
				levels: [1, 2, 3],
			}),
		],
		content: projectNote,
		onUpdate: ({ editor }) => {
			const content = JSON.stringify(editor.getJSON())
			setProjectNote(JSON.parse(content))
		},
	})

	if (!editor) {
		return null
	}

	return (
		<div className="flex flex-col w-full heightAvailable p-2">
			<div className="flex gap-2 pb-2 w-full flex-wrap">
				<div>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().toggleBold().run()}
						className={cn(
							'bg-transparent rounded-r-none border border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive('bold'),
							},
						)}
					>
						<Bold />
					</Button>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().toggleItalic().run()}
						className={cn(
							'bg-transparent rounded-none border border-l-0 border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive('italic'),
							},
						)}
					>
						<Italic />
					</Button>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().toggleUnderline().run()}
						className={cn(
							'bg-transparent rounded-none border border-l-0 border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground':
									editor.isActive('underline'),
							},
						)}
					>
						<UnderlineIcon />
					</Button>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().toggleStrike().run()}
						className={cn(
							'bg-transparent rounded-l-none border border-l-0 border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive('strike'),
							},
						)}
					>
						<Strikethrough />
					</Button>
				</div>
				<div>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().toggleHighlight().run()}
						className={cn(
							'bg-transparent rounded-r-none border border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground':
									editor.isActive('highlight'),
							},
						)}
					>
						<Highlighter />
					</Button>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
						className={cn(
							'bg-transparent rounded-l-none border border-l-0 border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground':
									editor.isActive('codeBlock'),
							},
						)}
					>
						<Code />
					</Button>
				</div>
				<div>
					<Button
						size={'icon'}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
						className={cn(
							'bg-transparent rounded-r-none border border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive(
									'heading',
									{
										level: 1,
									},
								),
							},
						)}
					>
						<Heading1 />
					</Button>
					<Button
						size={'icon'}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
						className={cn(
							'bg-transparent rounded-none border border-l-0 border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive(
									'heading',
									{
										level: 2,
									},
								),
							},
						)}
					>
						<Heading2 />
					</Button>
					<Button
						size={'icon'}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						}
						className={cn(
							'bg-transparent rounded-l-none border border-l-0 border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive(
									'heading',
									{
										level: 3,
									},
								),
							},
						)}
					>
						<Heading3 />
					</Button>
				</div>
				<div>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={cn(
							'bg-transparent rounded-r-none border border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground':
									editor.isActive('bulletList'),
							},
						)}
					>
						<List />
					</Button>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={cn(
							'bg-transparent rounded-l-none border border-l-0 border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground':
									editor.isActive('orderedList'),
							},
						)}
					>
						<ListOrdered />
					</Button>
				</div>
				<div>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().setTextAlign('left').run()}
						className={cn(
							'bg-transparent rounded-r-none border border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive({
									textAlign: 'left',
								}),
							},
						)}
					>
						<AlignLeft />
					</Button>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().setTextAlign('center').run()}
						className={cn(
							'bg-transparent rounded-none border border-l-none border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive({
									textAlign: 'center',
								}),
							},
						)}
					>
						<AlignCenter />
					</Button>
					<Button
						size={'icon'}
						onClick={() => editor.chain().focus().setTextAlign('right').run()}
						className={cn(
							'bg-transparent rounded-none border border-l-none border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive({
									textAlign: 'right',
								}),
							},
						)}
					>
						<AlignRight />
					</Button>
					<Button
						onClick={() => editor.chain().focus().setTextAlign('justify').run()}
						className={cn(
							'bg-transparent rounded-l-none border border-l-none border-primary/30 text-primary/70 font-extrabold hover:text-primary-foreground',
							{
								'bg-primary text-primary-foreground': editor.isActive({
									textAlign: 'justify',
								}),
							},
						)}
					>
						<AlignJustify />
					</Button>
				</div>
			</div>
			<EditorContent
				editor={editor}
				className="editor-content heightAvailable w-full h-full"
			/>
		</div>
	)
}

export default RichTextEditor
