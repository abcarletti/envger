import { ContactButton } from '@/components/contact-button'

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			{children}
			<ContactButton />
		</>
	)
}

export default PublicLayout
