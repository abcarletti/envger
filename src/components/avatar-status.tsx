import { auth } from '@/lib/auth'
import Image from 'next/image'

export default async function AvatarStatus() {
	const session = await auth()

	const imageUrl = session?.user?.image || 'https://placehold.co/40x40.png'

	return (
		<div className="flex items-center gap-4">
			<div className="font-medium dark:text-white">
				<div>{session?.user?.name}</div>
				<div className="text-sm text-gray-500 dark:text-gray-400">
					{session?.user?.email}
				</div>
			</div>
			<Image
				loading="lazy"
				className="size-10 rounded-full"
				width={40}
				height={40}
				src={imageUrl}
				alt=""
			/>
		</div>
	)
}
