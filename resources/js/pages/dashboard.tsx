import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Target,
    Scale,
    BarChart3,
    Calculator,
    TrendingUp,
    CheckCircle
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

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Sistem Penunjang Keputusan dengan Metode TOPSIS
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href="/topsis">
                            <Button variant="outline">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Lihat Hasil
                            </Button>
                        </Link>
                        <Button
                            onClick={() => router.post('/topsis/calculate')}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Calculator className="w-4 h-4 mr-2" />
                            Hitung TOPSIS
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.title}
                                </CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value.toLocaleString()}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Top 5 Hasil TOPSIS
                            </CardTitle>
                            <CardDescription>
                                Alternatif dengan skor preferensi tertinggi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {topResults && topResults.length > 0 ? (
                                <div className="space-y-4">
                                    {topResults.map((result, index) => (
                                        <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Badge variant={index < 3 ? "default" : "secondary"}>
                                                    #{result.rank}
                                                </Badge>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {result.alternative.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Skor: {result.preference_score.toFixed(4)}
                                                    </p>
                                                </div>
                                            </div>
                                            {index < 3 && (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Belum ada hasil perhitungan TOPSIS
                                    </p>
                                    <Link href="/topsis">
                                        <Button className="mt-4">
                                            Mulai Perhitungan
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Aksi cepat untuk mengelola data
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/alternatives/create">
                                    <Button
                                        variant="outline"
                                        className="h-20 flex-col w-full"
                                    >
                                        <Target className="w-6 h-6 mb-2" />
                                        <span>Tambah Alternatif</span>
                                    </Button>
                                </Link>
                                <Link href="/criteria/create">
                                    <Button
                                        variant="outline"
                                        className="h-20 flex-col w-full"
                                    >
                                        <Scale className="w-6 h-6 mb-2" />
                                        <span>Tambah Kriteria</span>
                                    </Button>
                                </Link>
                                <Link href="/evaluations">
                                    <Button
                                        variant="outline"
                                        className="h-20 flex-col w-full"
                                    >
                                        <BarChart3 className="w-6 h-6 mb-2" />
                                        <span>Input Evaluasi</span>
                                    </Button>
                                </Link>
                                <Link href="/topsis/charts">
                                    <Button
                                        variant="outline"
                                        className="h-20 flex-col w-full"
                                    >
                                        <TrendingUp className="w-6 h-6 mb-2" />
                                        <span>Lihat Grafik</span>
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Alternatives */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Alternatif Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentAlternatives && recentAlternatives.length > 0 ? (
                                <div className="space-y-3">
                                    {recentAlternatives.map((alternative) => (
                                        <div key={alternative.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {alternative.name}
                                                </p>
                                                {alternative.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                        {alternative.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                                    Belum ada alternatif
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Criteria */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kriteria Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentCriteria && recentCriteria.length > 0 ? (
                                <div className="space-y-3">
                                    {recentCriteria.map((criterion) => (
                                        <div key={criterion.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {criterion.name}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant={criterion.type === 'benefit' ? 'default' : 'secondary'}>
                                                        {criterion.type === 'benefit' ? 'Benefit' : 'Cost'}
                                                    </Badge>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        Bobot: {criterion.weight}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                                    Belum ada kriteria
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
