import { NextResponse } from 'next/server'

const TEAM_ID = 558
const SEASON = 2025

export async function GET() {
    const res = await fetch(
        `https://v3.football.api-sports.io/fixtures?team=${TEAM_ID}&league=140&season=${SEASON}&last=5`,
        {
            headers: {
                'x-apisports-key': process.env.APIFOOTBALL_KEY!,
            },
            next: { revalidate: 1800 },
        }
    )

    const data = await res.json()

    if (data.errors && Object.keys(data.errors).length > 0) {
        return NextResponse.json({ error: data.errors }, { status: 500 })
    }

    return NextResponse.json(data.response ?? [])
}