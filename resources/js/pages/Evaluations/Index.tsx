import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    Save,
    Target,
    Scale,
    Download
} from 'lucide-react';
import { useState } from 'react';
import { exportEvaluationsPDF } from '@/utils/pdfExport';

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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleValueChange = (alternativeId: number, criterionId: number, value: string) => {
        const key = `${alternativeId}-${criterionId}`;
        setEvaluationMatrix(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveAll = () => {
        // Tambahkan small delay untuk memastikan state sudah terupdate
        setTimeout(() => {
            // Ambil data dari DOM sebagai fallback jika state belum terupdate
            const evaluationsFromMatrix: {[key: string]: string} = {...evaluationMatrix};

            // Scan semua input fields untuk memastikan data terbaru
            const inputElements = document.querySelectorAll('input[data-alternative-id][data-criterion-id]');
            inputElements.forEach((input) => {
                const element = input as HTMLInputElement;
                const alternativeId = element.getAttribute('data-alternative-id');
                const criterionId = element.getAttribute('data-criterion-id');
                if (alternativeId && criterionId && element.value.trim() !== '') {
                    const key = `${alternativeId}-${criterionId}`;
                    evaluationsFromMatrix[key] = element.value;
                }
            });

            // Validasi data sebelum menyimpan
            const totalCells = alternatives.length * criteria.length;
            const filledCells = Object.values(evaluationsFromMatrix).filter(value => value && value.trim() !== '' && !isNaN(parseFloat(value))).length;

            if (filledCells === 0) {
                alert('Harap isi setidaknya satu nilai evaluasi sebelum menyimpan.');
                return;
            }

            // Konfirmasi penyimpanan
            if (!confirm(`Anda akan menyimpan ${filledCells} dari ${totalCells} evaluasi. Lanjutkan?`)) {
                return;
            }

            const evaluations = Object.entries(evaluationsFromMatrix)
                .filter(([, value]) => value && value.trim() !== '' && !isNaN(parseFloat(value)))
                .map(([key, value]) => {
                    const [alternativeId, criterionId] = key.split('-').map(Number);
                    return {
                        alternative_id: alternativeId,
                        criterion_id: criterionId,
                        value: parseFloat(value)
                    };
                });

            console.log('Sending evaluations:', evaluations); // Debug log

            if (evaluations.length === 0) {
                alert('Tidak ada data evaluasi yang valid untuk disimpan.');
                return;
            }

            setIsSubmitting(true);

            // Submit langsung dengan router.post
            router.post('/evaluations/bulk', {
                evaluations: evaluations
            }, {
                onSuccess: () => {
                    alert(`Berhasil menyimpan ${evaluations.length} evaluasi!`);
                    setIsSubmitting(false);
                    // Refresh halaman untuk mengambil data terbaru
                    window.location.reload();
                },
                onError: (errors: Record<string, string>) => {
                    console.error('Error saving evaluations:', errors);
                    alert('Terjadi kesalahan saat menyimpan evaluasi: ' + JSON.stringify(errors));
                    setIsSubmitting(false);
                }
            });
        }, 100); // Small delay to ensure state is updated
    };

    const getTotalEvaluations = () => {
        return Object.values(evaluationMatrix).filter(value => value && value.trim() !== '' && !isNaN(parseFloat(value))).length;
    };

    const getCompletionPercentage = () => {
        const total = alternatives.length * criteria.length;
        const completed = getTotalEvaluations();
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const handleExportPDF = () => {
        // Create evaluations array from current data
        const evaluationsData = alternatives.flatMap(alternative =>
            alternative.evaluations.map(evaluation => ({
                id: evaluation.id,
                alternative_id: evaluation.alternative_id,
                criterion_id: evaluation.criterion_id,
                value: evaluation.value,
                alternative: alternative,
                criterion: evaluation.criterion
            }))
        );
        exportEvaluationsPDF(alternatives, criteria, evaluationsData);
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
                        {getTotalEvaluations() > 0 && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleExportPDF}
                                    className="border-purple-200 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export PDF
                                </Button>
                                <Link href="/topsis">
                                    <Button
                                        variant="outline"
                                        className="border-green-200 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40"
                                    >
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        Lihat Hasil TOPSIS
                                    </Button>
                                </Link>
                            </>
                        )}
                        <Button
                            onClick={handleSaveAll}
                            disabled={isSubmitting || getTotalEvaluations() === 0}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Menyimpan...' : `Simpan ${getTotalEvaluations()} Evaluasi`}
                        </Button>
                    </div>
                </div>

                {/* Warning if weights don't sum to 100% */}
                {Math.abs(criteria.reduce((sum, c) => sum + c.weight, 0) - 1.0) > 0.001 && (
                    <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">!</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                                        Peringatan: Total Bobot Kriteria
                                    </h4>
                                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Total bobot kriteria saat ini adalah {(criteria.reduce((sum, c) => sum + c.weight, 0) * 100).toFixed(1)}%.
                                        Untuk perhitungan TOPSIS yang akurat, total bobot harus 100% (1.0).
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

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
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Total bobot: {(criteria.reduce((sum, c) => sum + c.weight, 0) * 100).toFixed(1)}%
                                </p>
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
                                            <th className="border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-800 text-left min-w-[250px] sticky left-0 z-10">
                                                <div>
                                                    <span className="font-semibold text-neutral-900 dark:text-white">Alternatif / Kriteria</span>
                                                </div>
                                            </th>
                                            {criteria.map((criterion) => (
                                                <th key={criterion.id} className="border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-800 text-center min-w-[180px]">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="font-semibold text-neutral-900 dark:text-white text-sm">
                                                            {criterion.name}
                                                        </span>
                                                        <Badge
                                                            variant={criterion.type === 'benefit' ? 'default' : 'secondary'}
                                                            className="text-xs px-2 py-1"
                                                        >
                                                            {criterion.type === 'benefit' ? 'Benefit' : 'Cost'}
                                                        </Badge>
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                            Bobot: {(criterion.weight * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alternatives.map((alternative) => (
                                            <tr key={alternative.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                                <td className="border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50 dark:bg-neutral-900 sticky left-0 z-10">
                                                    <div>
                                                        <span className="font-semibold text-neutral-900 dark:text-white block">
                                                            {alternative.name}
                                                        </span>
                                                        {alternative.description && (
                                                            <span className="text-xs text-neutral-500 dark:text-neutral-400 block mt-1">
                                                                {alternative.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                {criteria.map((criterion) => {
                                                    const key = `${alternative.id}-${criterion.id}`;
                                                    const currentValue = evaluationMatrix[key] || '';
                                                    return (
                                                        <td key={criterion.id} className="border border-neutral-200 dark:border-neutral-800 p-3 text-center align-middle">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={currentValue}
                                                                    onChange={(e) => handleValueChange(alternative.id, criterion.id, e.target.value)}
                                                                    className="w-24 h-10 text-center text-sm font-medium"
                                                                    placeholder="0.00"
                                                                    title={`Masukkan nilai ${criterion.type === 'benefit' ? 'benefit' : 'cost'} untuk ${criterion.name}`}
                                                                    data-alternative-id={alternative.id}
                                                                    data-criterion-id={criterion.id}
                                                                />
                                                                {currentValue && (
                                                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                                        {criterion.type === 'benefit' ? '↗ Lebih tinggi = Lebih baik' : '↘ Lebih rendah = Lebih baik'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        Petunjuk Pengisian Nilai:
                                    </h4>
                                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                                        <li>• Masukkan nilai numerik (angka desimal atau bulat)</li>
                                        <li>• <strong>Format yang diterima:</strong> 7, 7.5, 8.25, 10.00</li>
                                        <li>• <strong>Kriteria Benefit (↗):</strong> Nilai lebih tinggi = Performa lebih baik</li>
                                        <li>• <strong>Kriteria Cost (↘):</strong> Nilai lebih rendah = Performa lebih baik</li>
                                        <li>• Gunakan skala yang konsisten untuk semua alternatif</li>
                                        <li>• Pastikan semua sel terisi sebelum menghitung TOPSIS</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                                        <Scale className="w-4 h-4" />
                                        Contoh Penilaian:
                                    </h4>
                                    <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
                                        <li>• <strong>Pengalaman Kerja (Benefit):</strong> 3 tahun, 5.5 tahun, 8 tahun</li>
                                        <li>• <strong>Kemampuan Teknis (Benefit):</strong> 7.5, 8, 9.25 (skala 1-10)</li>
                                        <li>• <strong>Komunikasi (Benefit):</strong> 8, 8.5, 9 (skala 1-10)</li>
                                        <li>• <strong>Absensi (Cost):</strong> 2, 1, 0 (hari tidak masuk/bulan)</li>
                                        <li>• <strong>Gaji Diminta (Cost):</strong> 8.5, 12, 15 (juta rupiah)</li>
                                    </ul>
                                </div>
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
