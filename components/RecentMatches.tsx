'use client'

import { useEffect, useState } from 'react'

interface Match {
    fixture: { id: number; date: string; status: { short: string } }
    teams: {
        home: { name: string; logo: string; winner: boolean | null }
        away: { name: string; logo: string; winner: boolean | null }
    }
    goals: { home: number | null; away: number | null }
    league: { round: string }
}

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

export default function RecentMatches() {
    const [matches, setMatches] = useState<Match[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/matches')
            .then(r => r.json())
            .then(data => {
                // Validamos que sea un array y no un objeto de error
                if (data.error || !Array.isArray(data)) {
                    console.error("Error de API Matches:", data);
                    setError('No se pudo cargar los partidos');
                } else {
                    setMatches(data);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.error("Error catch Matches:", e);
                setError('No se pudo cargar los partidos');
                setLoading(false);
            })
    }, [])

    if (loading) return <p className="text-center py-4 text-gray-500 text-sm">Cargando partidos...</p>
    if (error) return <p className="text-center py-4 text-red-500 text-sm">{error}</p>
    if (!matches || matches.length === 0) return null;

    return (
        <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b-2 border-blue-800 pb-2">
                ⚽ Últimos partidos
            </h2>
            <div className="flex flex-col gap-3">
                {matches.map(({ fixture, teams, goals, league }) => {
                    if (!fixture || !teams) return null; // Prevenir crasheos si la API devuelve datos incompletos

                    const homeName = teams?.home?.name || '';
                    const awayName = teams?.away?.name || '';
                    const isHome = homeName.toLowerCase().includes('oviedo')

                    const oviedoWon = isHome ? teams?.home?.winner : teams?.away?.winner
                    const resultStyle =
                        oviedoWon === true  ? 'border-l-4 border-green-500 bg-green-50' :
                            oviedoWon === false ? 'border-l-4 border-red-500 bg-red-50'     :
                                'border-l-4 border-gray-400 bg-gray-50'

                    return (
                        <div key={fixture.id} className={`rounded-lg shadow-sm p-4 ${resultStyle}`}>
                            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                                {league?.round} · {formatDate(fixture.date)}
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className={`text-sm font-medium text-right ${isHome ? 'text-blue-900 font-bold' : ''}`}>
                    {homeName}
                  </span>
                                    <img src={teams?.home?.logo} alt={homeName} className="w-7 h-7 object-contain" />
                                </div>

                                <div className="flex items-center gap-1 px-3">
                                    <span className="text-xl font-bold text-gray-800 w-6 text-center">{goals?.home ?? '-'}</span>
                                    <span className="text-gray-400 mx-1">-</span>
                                    <span className="text-xl font-bold text-gray-800 w-6 text-center">{goals?.away ?? '-'}</span>
                                </div>

                                <div className="flex items-center gap-2 flex-1 justify-start">
                                    <img src={teams?.away?.logo} alt={awayName} className="w-7 h-7 object-contain" />
                                    <span className={`text-sm font-medium ${!isHome && awayName.toLowerCase().includes('oviedo') ? 'text-blue-900 font-bold' : ''}`}>
                    {awayName}
                  </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}