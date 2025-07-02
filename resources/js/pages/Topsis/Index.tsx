import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Calculator,
    Trophy,
    TrendingUp,
    BarChart3,
    Award,
    Target
} from 'lucide-react';

interface Alternative {
    id: number;
    name: string;
    description?: string;
}

interface TopsisResult {
    id: number;
    rank: number;
    distance_positive: number;
    distance_negative: number;
    preference_score: number;
    alternative: Alternative;
}

interface Props {
    results: TopsisResult[];
}

export default function Index({ results }: Props) {
    const handleCalculate = () => {
        if (confirm('Apakah Anda yakin ingin menghitung ulang hasil TOPSIS? Hasil sebelumnya akan diganti.')) {
            router.post('/topsis/calculate');
        }
    };

    const getRankBadgeVariant = (rank: number) => {
        if (rank === 1) return 'default';
        if (rank <= 3) return 'secondary';
        return 'outline';
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
        return <Target className="w-5 h-5 text-gray-400" />;
    };

    return (
        <AppLayout>
            <Head title="Hasil TOPSIS" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hasil TOPSIS</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Hasil perhitungan sistem penunjang keputusan dengan metode TOPSIS
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href="/topsis/charts">
                            <Button variant="outline">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Lihat Grafik
                            </Button>
                        </Link>
                        <Button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-700">
                            <Calculator className="w-4 h-4 mr-2" />
                            Hitung TOPSIS
                        </Button>
                    </div>
                </div>

                {results.length > 0 ? (
                    <>
                        {/* Top 3 Results */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {results.slice(0, 3).map((result) => (
                                <Card key={result.id} className={`${
                                    result.rank === 1 ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10' :
                                    result.rank === 2 ? 'border-gray-200 bg-gray-50 dark:bg-gray-800/50' :
                                    'border-orange-200 bg-orange-50 dark:bg-orange-900/10'
                                }`}>
                                    <CardHeader className="text-center">
                                        <div className="flex justify-center mb-2">
                                            {getRankIcon(result.rank)}
                                        </div>
                                        <CardTitle className="text-xl">
                                            {result.alternative.name}
                                        </CardTitle>
                                        <CardDescription>
                                            Peringkat #{result.rank}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Skor Preferensi</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {Number(result.preference_score).toFixed(4)}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-400">D+</p>
                                                    <p className="font-medium">{Number(result.distance_positive).toFixed(4)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-400">D-</p>
                                                    <p className="font-medium">{Number(result.distance_negative).toFixed(4)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* All Results Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2" />
                                    Semua Hasil Perhitungan
                                </CardTitle>
                                <CardDescription>
                                    Daftar lengkap hasil perhitungan TOPSIS untuk semua alternatif
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4">Peringkat</th>
                                                <th className="text-left py-3 px-4">Alternatif</th>
                                                <th className="text-center py-3 px-4">Skor Preferensi</th>
                                                <th className="text-center py-3 px-4">Jarak ke Solusi Ideal Positif (D+)</th>
                                                <th className="text-center py-3 px-4">Jarak ke Solusi Ideal Negatif (D-)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((result) => (
                                                <tr key={result.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center space-x-2">
                                                            {getRankIcon(result.rank)}
                                                            <Badge variant={getRankBadgeVariant(result.rank)}>
                                                                #{result.rank}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {result.alternative.name}
                                                            </p>
                                                            {result.alternative.description && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {result.alternative.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="font-mono text-lg font-semibold">
                                                            {Number(result.preference_score).toFixed(4)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="font-mono">
                                                            {Number(result.distance_positive).toFixed(6)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="font-mono">
                                                            {Number(result.distance_negative).toFixed(6)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Calculator className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Belum ada hasil perhitungan
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                Mulai dengan menghitung hasil TOPSIS berdasarkan data alternatif, kriteria, dan evaluasi yang telah diinput.
                            </p>
                            <Button onClick={handleCalculate} className="bg-blue-600 hover:bg-blue-700">
                                <Calculator className="w-4 h-4 mr-2" />
                                Mulai Perhitungan TOPSIS
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
