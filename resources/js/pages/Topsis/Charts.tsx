import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    BarChart3,
    TrendingUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export default function Charts({ results }: Props) {
    // Prepare data for charts
    const chartData = results.map((result, index) => ({
        name: result.alternative.name,
        rank: result.rank,
        preferenceScore: parseFloat(Number(result.preference_score).toFixed(4)),
        distancePositive: parseFloat(Number(result.distance_positive).toFixed(4)),
        distanceNegative: parseFloat(Number(result.distance_negative).toFixed(4)),
        color: COLORS[index % COLORS.length]
    }));

    const pieData = results.slice(0, 5).map((result, index) => ({
        name: result.alternative.name,
        value: parseFloat(Number(result.preference_score).toFixed(4)),
        color: COLORS[index % COLORS.length]
    }));

    return (
        <AppLayout>
            <Head title="Grafik Hasil TOPSIS" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 mt-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/topsis">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Grafik Hasil TOPSIS</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Visualisasi hasil perhitungan sistem penunjang keputusan
                        </p>
                    </div>
                </div>

                {results.length > 0 ? (
                    <div className="space-y-8">
                        {/* Preference Score Bar Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BarChart3 className="w-5 h-5 mr-2" />
                                    Grafik Skor Preferensi
                                </CardTitle>
                                <CardDescription>
                                    Perbandingan skor preferensi semua alternatif
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="name"
                                                angle={-45}
                                                textAnchor="end"
                                                height={100}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="preferenceScore"
                                                fill="#3B82F6"
                                                name="Skor Preferensi"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Distance Comparison Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2" />
                                    Perbandingan Jarak ke Solusi Ideal
                                </CardTitle>
                                <CardDescription>
                                    Jarak ke solusi ideal positif (D+) dan negatif (D-)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="name"
                                                angle={-45}
                                                textAnchor="end"
                                                height={100}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="distancePositive"
                                                fill="#EF4444"
                                                name="Jarak ke Solusi Ideal Positif (D+)"
                                            />
                                            <Bar
                                                dataKey="distanceNegative"
                                                fill="#10B981"
                                                name="Jarak ke Solusi Ideal Negatif (D-)"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top 5 Pie Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribusi Skor Top 5 Alternatif</CardTitle>
                                    <CardDescription>
                                        Persentase skor preferensi 5 alternatif teratas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }: { name?: string; percent?: number }) =>
                                                        `${name} (${((percent || 0) * 100).toFixed(1)}%)`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Preference Score Line Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tren Skor Preferensi</CardTitle>
                                    <CardDescription>
                                        Tren skor preferensi berdasarkan ranking
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="rank" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="preferenceScore"
                                                    stroke="#8884d8"
                                                    strokeWidth={3}
                                                    name="Skor Preferensi"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Summary Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistik Ringkasan</CardTitle>
                                <CardDescription>
                                    Ringkasan statistik hasil perhitungan TOPSIS
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {results.length}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Total Alternatif
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            {Math.max(...results.map(r => Number(r.preference_score))).toFixed(4)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Skor Tertinggi
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-orange-600">
                                            {Math.min(...results.map(r => Number(r.preference_score))).toFixed(4)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Skor Terendah
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-600">
                                            {(results.reduce((sum, r) => sum + Number(r.preference_score), 0) / results.length).toFixed(4)}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Rata-rata Skor
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Belum ada data untuk ditampilkan
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                Lakukan perhitungan TOPSIS terlebih dahulu untuk melihat grafik hasil.
                            </p>
                            <Link href="/topsis">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Lihat Hasil TOPSIS
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
