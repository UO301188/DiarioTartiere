import { NextResponse } from 'next/server'

export async function GET() {
    // 141 = LaLiga Hypermotion (Segunda División)
    const res = await fetch(
        'https://v3.football.api-sports.io/standings?league=141&season=2026',
        {
            headers: {
                'x-apisports-key': process.env.API_FOOTBALL_KEY || '',
            },
            next: { revalidate: 3600 },
        }
    )

    const data = await res.json()

    if (data.errors && Object.keys(data.errors).length > 0) {
        return NextResponse.json({ error: 'Error API-Football' }, { status: 500 })
    }

    const rawStandings = data.response?.[0]?.league?.standings?.[0] || []

    // Mapeo para mantener compatibilidad con la interfaz TeamStanding de tu UI
    const table = rawStandings.map((row: any) => ({
        position: row.rank,
        team: {
            id: row.team.id,
            name: row.team.name,
            crest: row.team.logo
        },
        points: row.points,
        goalDifference: row.goalsDiff,
        playedGames: row.all.played,
        won: row.all.win,
        draw: row.all.draw,
        lost: row.all.lose
    }))

    return NextResponse.json(table)
}