import { NextResponse } from 'next/server'

export async function GET() {
    const res = await fetch(
        'https://api.football-data.org/v4/competitions/PD/matches?status=FINISHED',
        {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_DATA_KEY || 'c1de3797368e4b3bb333295c99318aa8',
            },
            next: { revalidate: 1800 },
        }
    )

    const data = await res.json()

    if (data.errorCode || data.error) {
        return NextResponse.json({ error: data.message || 'Error API' }, { status: 500 })
    }

    const matches = data.matches ?? []

    // Filtramos para quedarnos solo con los del Oviedo y sacamos los últimos 5
    const oviedoMatches = matches
        .filter((m: any) =>
            m.homeTeam?.name.toLowerCase().includes('oviedo') ||
            m.awayTeam?.name.toLowerCase().includes('oviedo')
        )
        .slice(-5)
        .reverse() // Para que el más reciente salga arriba

    return NextResponse.json(oviedoMatches)
}