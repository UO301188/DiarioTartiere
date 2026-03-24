'use client'

import { useEffect, useState } from 'react'

interface TeamStanding {
    position: number
    team: { id: number; name: string; crest: string }
    points: number
    goalDifference: number
    playedGames: number
    won: number
    draw: number
    lost: number
}

export default function StandingsTable() {
    const [standings, setStandings] = useState<TeamStanding[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/standings')
            .then(r => r.json())
            .then(data => {
                if (data.error || !Array.isArray(data)) {
                    setError('No se pudo cargar la clasificación');
                } else {
                    setStandings(data);
                }
                setLoading(false);
            })
            .catch(() => {
                setError('No se pudo cargar la clasificación');
                setLoading(false);
            })
    }, [])

    if (loading) return <p className="text-center py-4 text-gray-500 text-sm">Cargando clasificación...</p>
    if (error) return <p className="text-center py-4 text-red-500 text-sm">{error}</p>
    if (!standings || standings.length === 0) return null;

    return (
        <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-900 border-b-2 border-blue-800 pb-2">
                📊 Clasificación Liga EaSports 2025/26
            </h2>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full text-sm">
                    <thead className="bg-blue-900 text-white">
                    <tr>
                        <th className="py-2 px-2 text-center">#</th>
                        <th className="py-2 px-2 text-left">Equipo</th>
                        <th className="py-2 px-2 text-center">PJ</th>
                        <th className="py-2 px-2 text-center">G</th>
                        <th className="py-2 px-2 text-center">E</th>
                        <th className="py-2 px-2 text-center">P</th>
                        <th className="py-2 px-2 text-center">DG</th>
                        <th className="py-2 px-2 text-center font-bold">Pts</th>
                    </tr>
                    </thead>
                    <tbody>
                    {standings.map((row) => {
                        const isOviedo = row?.team?.name?.toLowerCase().includes('oviedo')
                        return (
                            <tr
                                key={row?.team?.id || Math.random()}
                                className={`border-b transition-colors ${
                                    isOviedo
                                        ? 'bg-blue-100 font-semibold border-blue-300'
                                        : row.position <= 4
                                            ? 'bg-green-50'
                                            : row.position >= 18
                                                ? 'bg-red-50'
                                                : 'hover:bg-gray-50'
                                }`}
                            >
                                <td className="py-2 px-2 text-center text-gray-600">{row.position}</td>
                                <td className="py-2 px-2">
                                    <div className="flex items-center gap-2">
                                        <img src={row?.team?.crest} alt={row?.team?.name} className="w-5 h-5 object-contain" />
                                        <span className={isOviedo ? 'text-blue-900 font-bold' : ''}>{row?.team?.name}</span>
                                    </div>
                                </td>
                                <td className="py-2 px-2 text-center">{row?.playedGames}</td>
                                <td className="py-2 px-2 text-center text-green-700">{row?.won}</td>
                                <td className="py-2 px-2 text-center text-gray-500">{row?.draw}</td>
                                <td className="py-2 px-2 text-center text-red-600">{row?.lost}</td>
                                <td className="py-2 px-2 text-center">
                                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                                </td>
                                <td className="py-2 px-2 text-center font-bold text-blue-900">{row.points}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}