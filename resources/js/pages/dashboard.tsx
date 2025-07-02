import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Target,
    Scale,
    BarChart3,
    Calculator,
    TrendingUp
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';

interface Stats {
    alternatives_count: number;
    criteria_count: number;
    evaluations_count: number;
    results_count: number;
}

interface Alternative {
    id: number;
    name: string;
    description?: string;
    created_at: string;
}

interface Criterion {
    id: number;
    name: string;
    description?: string;
    weight: number;
    type: 'benefit' | 'cost';
    created_at: string;
}

interface TopsisResult {
    id: number;
    rank: number;
    preference_score: number;
    alternative: Alternative;
}

interface Props {
    stats: Stats;
    topResults: TopsisResult[];
    recentAlternatives: Alternative[];
    recentCriteria: Criterion[];
}

export default function Dashboard({ stats, topResults, recentAlternatives, recentCriteria }: Props) {
    const statCards = [
        {
            title: 'Alternatif',
            value: stats.alternatives_count,
            icon: <Target className="h-8 w-8 text-blue-600" />,
            description: 'Total alternatif yang tersedia',
            href: '/alternatives'
        },
        {
            title: 'Kriteria',
            value: stats.criteria_count,
            icon: <Scale className="h-8 w-8 text-green-600" />,
            description: 'Total kriteria penilaian',
            href: '/criteria'
        },
        {
            title: 'Evaluasi',
            value: stats.evaluations_count,
            icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
            description: 'Total evaluasi yang telah dilakukan',
            href: '/evaluations'
        },
        {
            title: 'Hasil TOPSIS',
            value: stats.results_count,
            icon: <Calculator className="h-8 w-8 text-orange-600" />,
            description: 'Total hasil perhitungan',
            href: '/topsis'
        }
    ];

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="max-w-screen-xl mx-auto px-4 md:px-8 mt-10">
                <div className="min-h-screen bg-white dark:bg-neutral-950 p-6 -m-6">
                    {/* Hero Section */}
                    <div className="relative rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-8 px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">SPK TOPSIS</h1>
                                <p className="text-lg text-neutral-600 dark:text-neutral-300 font-medium mt-1">Sistem Penunjang Keputusan Cerdas</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/topsis">
                                <Button variant="outline" className="border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 px-6 py-3">
                                    <BarChart3 className="w-5 h-5 mr-2" />
                                    Lihat Hasil
                                </Button>
                            </Link>
                            <Button
                                onClick={() => router.post('/topsis/calculate')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-md"
                            >
                                <Calculator className="w-5 h-5 mr-2" />
                                Hitung TOPSIS
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <Card key={index} className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition cursor-pointer group">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                        {stat.title}
                                    </CardTitle>
                                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900">
                                        <div className="text-blue-600 dark:text-blue-400">{stat.icon}</div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
                                        {stat.value.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{stat.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Top Results - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-2xl font-bold gap-3">
                                        <TrendingUp className="w-6 h-6 text-yellow-500" />
                                        <span className="text-neutral-900 dark:text-white">Top 5 Hasil TOPSIS</span>
                                    </CardTitle>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Alternatif dengan skor preferensi tertinggi</p>
                                </CardHeader>
                                <CardContent>
                                    {topResults && topResults.length > 0 ? (
                                        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                            {topResults.slice(0, 5).map((result) => (
                                                <div key={result.id} className="flex items-center py-4 gap-4">
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xl">
                                                        {result.rank}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-neutral-900 dark:text-white">{result.alternative.name}</p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Skor: {Number(result.preference_score).toFixed(4)}</p>
                                                    </div>
                                                    <Badge variant="secondary">Peringkat #{result.rank}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">Belum ada hasil perhitungan</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        {/* Sidebar: Recent Alternatives & Criteria */}
                        <div className="space-y-6">
                            {/* Recent Alternatives */}
                            <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg font-bold gap-2">
                                        <Target className="w-5 h-5 text-blue-600" />
                                        <span className="text-neutral-900 dark:text-white">Alternatif Terbaru</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentAlternatives && recentAlternatives.length > 0 ? (
                                        <div className="space-y-3">
                                            {recentAlternatives.slice(0, 4).map((alternative) => (
                                                <div key={alternative.id} className="flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-neutral-900 dark:text-white">{alternative.name}</p>
                                                        {alternative.description && (
                                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-normal break-words line-clamp-2 mt-1">{alternative.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">Belum ada alternatif</p>
                                    )}
                                </CardContent>
                            </Card>
                            {/* Recent Criteria */}
                            <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg font-bold gap-2">
                                        <Scale className="w-5 h-5 text-purple-600" />
                                        <span className="text-neutral-900 dark:text-white">Kriteria Terbaru</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {recentCriteria && recentCriteria.length > 0 ? (
                                        <div className="space-y-3">
                                            {recentCriteria.slice(0, 4).map((criterion) => (
                                                <div key={criterion.id} className="flex items-center p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition">
                                                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-neutral-900 dark:text-white">{criterion.name}</p>
                                                        {criterion.description && (
                                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-normal break-words line-clamp-2 mt-1">{criterion.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">Belum ada kriteria</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
