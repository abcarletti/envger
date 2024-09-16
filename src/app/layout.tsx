import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import { ProjectStoreProvider } from '@/providers/project-store-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import QueryProvider from '../providers/tanstack-query'
import './globals.css'

const ibm = IBM_Plex_Mono({
	weight: ['100', '200', '300', '400', '500', '600', '700'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Secret notes 🔐',
	description:
		'Aplicación para manejar los accesos a recursos para desarrolladores',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="es" suppressHydrationWarning>
			<body className={ibm.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<ProjectStoreProvider>
						<QueryProvider>{children}</QueryProvider>
					</ProjectStoreProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
