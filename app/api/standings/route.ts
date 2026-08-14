import { NextResponse } from 'next/server'

export async function GET() {
    const res = await fetch(
        'https://api.football-data.org/v4/competitions/SD/standings?season=2026',
        {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_DATA_KEY || 'c1de3797368e4b3bb333295c99318aa8',
            },
            next: { revalidate: 3600 },
        }
    )

    const data = await res.json()

    if (data.errorCode || data.error) {
        return NextResponse.json({ error: data.message || 'Error API' }, { status: 500 })
    }

    const table = data.standings?.[0]?.table ?? []
    return NextResponse.json(table)
}