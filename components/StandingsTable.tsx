'use client'

import { useEffect, useState } from 'react'

interface TeamStanding {
    rank: number
    team: { id: number; name: string; logo: string }
    points: number
    goalsDiff: number
    all: { played: number; win: number; draw: number; lose: number }
}

export default function StandingsTable() {
    const [standings, setStandings] = useState<TeamStanding[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/standings')
            .then(r => r.json())
            .then(data => { setStandings(data); setLoading(false) })
            .catch(() => { setError('No se pudo cargar la clasificación'); setLoading(false) })
    }, [])

    if (loading) return <p className="text-center py-4 text-gray-500">Cargando clasificación...</p>
    if (error) return <p className="text-center py-4 text-red-500">{error}</p>

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
                        const isOviedo = row.team.name.toLowerCase().includes('oviedo')
                        return (
                            <tr
                                key={row.team.id}
                                className={`border-b transition-colors ${
                                    isOviedo
                                        ? 'bg-blue-100 font-semibold border-blue-300'
                                        : row.rank <= 4
                                            ? 'bg-green-50'
                                            : row.rank >= 18
                                                ? 'bg-red-50'
                                                : 'hover:bg-gray-50'
                                }`}
                            >
                                <td className="py-2 px-2 text-center text-gray-600">{row.rank}</td>
                                <td className="py-2 px-2">
                                    <div className="flex items-center gap-2">
                                        <img src={row.team.logo} alt={row.team.name} className="w-5 h-5 object-contain" />
                                        <span className={isOviedo ? 'text-blue-900 font-bold' : ''}>{row.team.name}</span>
                                    </div>
                                </td>
                                <td className="py-2 px-2 text-center">{row.all.played}</td>
                                <td className="py-2 px-2 text-center text-green-700">{row.all.win}</td>
                                <td className="py-2 px-2 text-center text-gray-500">{row.all.draw}</td>
                                <td className="py-2 px-2 text-center text-red-600">{row.all.lose}</td>
                                <td className="py-2 px-2 text-center">
                                    {row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}
                                </td>
                                <td className="py-2 px-2 text-center font-bold text-blue-900">{row.points}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div className="flex gap-4 text-xs p-2 bg-gray-50 text-gray-600 border-t">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm inline-block"></span>
            Champions / Europa
          </span>
                    <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm inline-block"></span>
            Descenso
          </span>
                </div>
            </div>
        </section>
    )
}