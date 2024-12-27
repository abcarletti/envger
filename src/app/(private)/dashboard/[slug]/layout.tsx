import ProjectLayout from '@/components/layouts/project-layout'

export default function RootLayout({
	children,
	params: { slug },
}: Readonly<{
	children: React.ReactNode
	params: { slug: string }
}>) {
	return <ProjectLayout slug={slug}>{children}</ProjectLayout>
}
