import { NextResponse } from 'next/server'

export async function GET() {
	try {
		// Basic health check response
		return NextResponse.json(
			{
				status: 'OK',
				timestamp: new Date().toISOString(),
				uptime: process.uptime(),
			},
			{
				status: 200,
			},
		)
	} catch (error) {
		// Return error response if something goes wrong
		return NextResponse.json(
			{
				status: 'KO',
				error: error instanceof Error ? error.message : 'Unknown error',
				timestamp: new Date().toISOString(),
			},
			{
				status: 500,
			},
		)
	}
}
