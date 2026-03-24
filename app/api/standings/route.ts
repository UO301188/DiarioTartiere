import { NextResponse } from 'next/server'

const LEAGUE_ID = 140
const SEASON = 2025

export async function GET() {
    const res = await fetch(
        `https://v3.football.api-sports.io/standings?league=${LEAGUE_ID}&season=${SEASON}`,
        {
            headers: {
                'x-apisports-key': process.env.APIFOOTBALL_KEY!,
            },
            next: { revalidate: 3600 },
        }
    )

    const data = await res.json()

    if (data.errors && Object.keys(data.errors).length > 0) {
        return NextResponse.json({ error: data.errors }, { status: 500 })
    }

    const standings = data.response?.[0]?.league?.standings?.[0] ?? []
    return NextResponse.json(standings)
}