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
    Target,
    Download
} from 'lucide-react';
import { exportTopsisResultsPDF } from '@/utils/pdfExport';

interface Alternative {
    id: number;
    name: string;
    description?: string;
}

interface Criterion {
    id: number;
    name: string;
    description?: string;
    weight: number;
    type: 'benefit' | 'cost';
}

interface TopsisResult {
    id: number;
    rank: number;
    distance_positive: number | string;
    distance_negative: number | string;
    preference_score: number | string;
    alternative: Alternative;
}

interface Props {
    results: TopsisResult[];
    criteria: Criterion[];
}

export default function Index({ results, criteria }: Props) {
    const handleCalculate = () => {
        if (confirm('Apakah Anda yakin ingin menghitung ulang hasil TOPSIS? Hasil sebelumnya akan diganti.')) {
            router.post('/topsis/calculate');
        }
    };

    const handleExportPDF = () => {
        // Convert to format expected by PDF export
        const formattedResults = results.map(result => ({
            id: result.id,
            alternative_id: result.alternative.id,
            positive_distance: result.distance_positive,
            negative_distance: result.distance_negative,
            preference_score: result.preference_score,
            rank: result.rank,
            alternative: result.alternative
        }));
        exportTopsisResultsPDF(formattedResults, criteria);
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

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 mt-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Hasil TOPSIS</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Hasil perhitungan sistem penunjang keputusan dengan metode TOPSIS
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {results.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleExportPDF}
                                className="border-red-200 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export PDF
                            </Button>
                        )}
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {results.slice(0, 3).map((result) => (
                                <Card key={result.id} className={`${
                                    result.rank === 1 ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10' :
                                    result.rank === 2 ? 'border-gray-200 bg-gray-50 dark:bg-gray-800/50' :
                                    'border-orange-200 bg-orange-50 dark:bg-orange-900/10'
                                } shadow-sm` }>
                                    <CardHeader className="text-center pt-8 pb-2">
                                        <div className="flex justify-center mb-2">
                                            {getRankIcon(result.rank)}
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-white">
                                            {result.alternative.name}
                                        </CardTitle>
                                        <CardDescription className="text-neutral-500 dark:text-neutral-400 mt-1">
                                            Peringkat #{result.rank}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center pb-8">
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Skor Preferensi</p>
                                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                                                    {Number(result.preference_score).toFixed(4)}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-neutral-600 dark:text-neutral-400">D+</p>
                                                    <p className="font-medium">{Number(result.distance_positive).toFixed(4)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-neutral-600 dark:text-neutral-400">D-</p>
                                                    <p className="font-medium">{Number(result.distance_negative).toFixed(4)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* All Results Table */}
                        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm mt-8">
                            <CardHeader className="px-6 pt-6 pb-2">
                                <CardTitle className="flex items-center text-xl font-bold text-neutral-900 dark:text-white">
                                    <TrendingUp className="w-5 h-5 mr-2" />
                                    Semua Hasil Perhitungan
                                </CardTitle>
                                <CardDescription className="text-neutral-500 dark:text-neutral-400 mt-1">
                                    Daftar lengkap hasil perhitungan TOPSIS untuk semua alternatif
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
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
                                                <tr key={result.id} className="border-b hover:bg-neutral-50 dark:hover:bg-neutral-800">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            {getRankIcon(result.rank)}
                                                            <Badge variant={getRankBadgeVariant(result.rank)}>
                                                                #{result.rank}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="font-medium text-neutral-900 dark:text-white">
                                                                {result.alternative.name}
                                                            </p>
                                                            {result.alternative.description && (
                                                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
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
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Calculator className="w-16 h-16 text-neutral-400 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                                Belum ada hasil perhitungan
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
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
