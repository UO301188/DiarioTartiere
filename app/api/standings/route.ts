import { NextResponse } from 'next/server'

export async function GET() {
    try {
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

        // Log completo para verlo en los logs de Vercel (Runtime Logs)
        console.log('API-Football status:', res.status)
        console.log('API-Football body:', JSON.stringify(data).slice(0, 500))

        if (!res.ok) {
            return NextResponse.json(
                { error: `API-Football respondió ${res.status}`, detail: data },
                { status: 502 }
            )
        }

        if (data.errors && Object.keys(data.errors).length > 0) {
            return NextResponse.json({ error: data.errors }, { status: 502 })
        }

        const rawStandings = data.response?.[0]?.league?.standings?.[0] || []

        const table = rawStandings.map((row: any) => ({
            position: row.rank,
            team: { id: row.team.id, name: row.team.name, crest: row.team.logo },
            points: row.points,
            goalDifference: row.goalsDiff,
            playedGames: row.all.played,
            won: row.all.win,
            draw: row.all.draw,
            lost: row.all.lose,
        }))

        return NextResponse.json(table)
    } catch (err: any) {
        console.error('Error en /api/standings:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}