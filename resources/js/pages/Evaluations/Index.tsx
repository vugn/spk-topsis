import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Plus,
    Save,
    Target,
    Scale
} from 'lucide-react';
import { useState } from 'react';

interface Alternative {
    id: number;
    name: string;
    description?: string;
    evaluations: Evaluation[];
}

interface Criterion {
    id: number;
    name: string;
    description?: string;
    weight: number;
    type: 'benefit' | 'cost';
}

interface Evaluation {
    id: number;
    alternative_id: number;
    criterion_id: number;
    value: number;
    criterion: Criterion;
}

interface Props {
    alternatives: Alternative[];
    criteria: Criterion[];
}

export default function Index({ alternatives, criteria }: Props) {
    const [evaluationMatrix, setEvaluationMatrix] = useState<{ [key: string]: string }>(() => {
        const matrix: { [key: string]: string } = {};
        alternatives.forEach(alternative => {
            alternative.evaluations.forEach(evaluation => {
                const key = `${alternative.id}-${evaluation.criterion_id}`;
                matrix[key] = evaluation.value.toString();
            });
        });
        return matrix;
    });

    const { setData, post, processing } = useForm({
        evaluations: [] as Array<{
            alternative_id: number;
            criterion_id: number;
            value: number;
        }>
    });

    const handleValueChange = (alternativeId: number, criterionId: number, value: string) => {
        const key = `${alternativeId}-${criterionId}`;
        setEvaluationMatrix(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveAll = () => {
        const evaluations = Object.entries(evaluationMatrix).map(([key, value]) => {
            const [alternativeId, criterionId] = key.split('-').map(Number);
            return {
                alternative_id: alternativeId,
                criterion_id: criterionId,
                value: parseFloat(value) || 0
            };
        }).filter(evaluation => evaluation.value > 0);

        setData('evaluations', evaluations);
        post('/evaluations/bulk', {
            onSuccess: () => {
                alert('Semua evaluasi berhasil disimpan!');
            },
            onError: () => {
                alert('Terjadi kesalahan saat menyimpan evaluasi.');
            }
        });
    };

    const getTotalEvaluations = () => {
        return Object.values(evaluationMatrix).filter(value => value && parseFloat(value) > 0).length;
    };

    const getCompletionPercentage = () => {
        const total = alternatives.length * criteria.length;
        const completed = getTotalEvaluations();
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    return (
        <AppLayout>
            <Head title="Evaluasi" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 mt-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Evaluasi</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Masukkan nilai evaluasi untuk setiap alternatif terhadap kriteria
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSaveAll}
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Semua'}
                        </Button>
                    </div>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <Target className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Alternatif</p>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{alternatives.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <Scale className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Kriteria</p>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{criteria.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <BarChart3 className="w-8 h-8 text-purple-600" />
                            <div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Evaluasi</p>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{getTotalEvaluations()}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base ${
                                getCompletionPercentage() === 100 ? 'bg-green-500' :
                                getCompletionPercentage() >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}>
                                {getCompletionPercentage()}%
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Kelengkapan</p>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{getCompletionPercentage()}%</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Evaluation Matrix */}
                {alternatives.length > 0 && criteria.length > 0 ? (
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <CardHeader className="px-6 pt-6 pb-2">
                            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">Matriks Evaluasi</CardTitle>
                            <CardDescription className="text-neutral-500 dark:text-neutral-400 mt-1">
                                Masukkan nilai evaluasi untuk setiap kombinasi alternatif dan kriteria
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-800 text-left min-w-[200px]">Alternatif / Kriteria</th>
                                            {criteria.map((criterion) => (
                                                <th key={criterion.id} className="border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50 dark:bg-neutral-800 text-center min-w-[120px]">
                                                    {criterion.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alternatives.map((alternative) => (
                                            <tr key={alternative.id}>
                                                <td className="border border-neutral-200 dark:border-neutral-800 p-3 font-semibold text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-900">
                                                    {alternative.name}
                                                </td>
                                                {criteria.map((criterion) => {
                                                    const key = `${alternative.id}-${criterion.id}`;
                                                    return (
                                                        <td key={criterion.id} className="border border-neutral-200 dark:border-neutral-800 p-2 text-center align-middle">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={evaluationMatrix[key] || ''}
                                                                onChange={(e) => handleValueChange(alternative.id, criterion.id, e.target.value)}
                                                                className="w-20 mx-auto text-center"
                                                            />
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                    Petunjuk Pengisian:
                                </h4>
                                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                    <li>• Masukkan nilai numerik untuk setiap kombinasi alternatif dan kriteria</li>
                                    <li>• <strong>Benefit:</strong> Nilai yang lebih tinggi menunjukkan performa yang lebih baik</li>
                                    <li>• <strong>Cost:</strong> Nilai yang lebih rendah menunjukkan performa yang lebih baik</li>
                                    <li>• Pastikan semua sel terisi sebelum melakukan perhitungan TOPSIS</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <BarChart3 className="w-16 h-16 text-neutral-400 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                                Data belum lengkap
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
                                Anda perlu menambahkan alternatif dan kriteria terlebih dahulu sebelum melakukan evaluasi.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/alternatives">
                                    <Button variant="outline">
                                        <Target className="w-4 h-4 mr-2" />
                                        Kelola Alternatif
                                    </Button>
                                </Link>
                                <Link href="/criteria">
                                    <Button variant="outline">
                                        <Scale className="w-4 h-4 mr-2" />
                                        Kelola Kriteria
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
