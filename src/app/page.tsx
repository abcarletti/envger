import { SignIn } from '@/components/login-page'
import { SignOut } from '@/components/signout-button'
import { auth } from '@/lib/auth'
import Image from 'next/image'

export default async function Home() {
	const session = await auth()
	return (
		<main className="pt-16">
			{session ? (
				<>
					<p>NAME: {session.user?.name}</p>
					<p>EMAIL: {session.user?.email}</p>
					<Image
						src={session.user?.image || '/images/placeholder.jpg'}
						alt="profile picture"
						width={100}
						height={100}
					/>
					<SignOut />
				</>
			) : (
				<SignIn />
			)}
		</main>
	)
}
