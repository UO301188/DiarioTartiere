import { NextResponse } from 'next/server'

export async function GET() {
    // league=141 (Hypermotion), team=798 (Real Oviedo), last=5 (Últimos 5 resultados)
    const res = await fetch(
        'https://v3.football.api-sports.io/fixtures?league=141&season=2026&team=798&last=5',
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

    const rawMatches = data.response || []

    // Mapeo para mantener compatibilidad con la interfaz Match de tu UI
    const matches = rawMatches.map((m: any) => {
        let winnerStatus = null;
        if (m.teams.home.winner === true) winnerStatus = 'HOME_TEAM';
        else if (m.teams.away.winner === true) winnerStatus = 'AWAY_TEAM';
        else if (m.teams.home.winner === false && m.teams.away.winner === false) winnerStatus = 'DRAW';

        // Extraer el número de jornada de textos como "Regular Season - 14"
        const matchdayNumber = parseInt(m.league.round.replace(/[^0-9]/g, '')) || 0;

        return {
            id: m.fixture.id,
            utcDate: m.fixture.date,
            matchday: matchdayNumber,
            homeTeam: {
                name: m.teams.home.name,
                crest: m.teams.home.logo
            },
            awayTeam: {
                name: m.teams.away.name,
                crest: m.teams.away.logo
            },
            score: {
                winner: winnerStatus,
                fullTime: {
                    home: m.goals.home,
                    away: m.goals.away
                }
            }
        }
    })

    return NextResponse.json(matches)
}