import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Scale,
    Edit,
    Trash2,
    Eye,
    Download
} from 'lucide-react';
import { exportCriteriaPDF } from '@/utils/pdfExport';

interface Criterion {
    id: number;
    name: string;
    description?: string;
    weight: number;
    type: 'benefit' | 'cost';
    evaluations_count: number;
    created_at: string;
}

interface Props {
    criteria: Criterion[];
    totalWeight: number;
    remainingWeight: number;
}

export default function Index({ criteria, totalWeight, remainingWeight }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kriteria ini?')) {
            router.delete(`/criteria/${id}`);
        }
    };

    const handleExportPDF = () => {
        exportCriteriaPDF(criteria);
    };

    return (
        <AppLayout>
            <Head title="Kriteria" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6 mt-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Kriteria</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Kelola kriteria penilaian untuk sistem penunjang keputusan
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {criteria.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleExportPDF}
                                className="border-green-200 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export PDF
                            </Button>
                        )}
                        <Link href="/criteria/create">
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                disabled={remainingWeight <= 0}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Kriteria
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Weight Summary */}
                {criteria.length > 0 && (
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                        Ringkasan Bobot Kriteria
                                    </h3>
                                    <div className="flex items-center gap-6">
                                        <div className="text-sm">
                                            <span className="text-blue-700 dark:text-blue-300">Total Bobot: </span>
                                            <span className={`font-bold ${Math.abs(totalWeight - 1.0) < 0.001 ? 'text-green-600' : totalWeight > 1.0 ? 'text-red-600' : 'text-yellow-600'}`}>
                                                {(totalWeight * 100).toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-blue-700 dark:text-blue-300">Sisa Bobot: </span>
                                            <span className={`font-bold ${remainingWeight <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {(remainingWeight * 100).toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {Math.abs(totalWeight - 1.0) < 0.001 ? (
                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                            ✓ Bobot Valid
                                        </Badge>
                                    ) : totalWeight > 1.0 ? (
                                        <Badge variant="destructive">
                                            ⚠ Bobot Berlebih
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                            ⚠ Bobot Kurang
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-blue-600 dark:text-blue-400">0%</span>
                                    <span className="text-xs text-blue-600 dark:text-blue-400">100%</span>
                                </div>
                                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${totalWeight > 1.0 ? 'bg-red-500' :
                                                Math.abs(totalWeight - 1.0) < 0.001 ? 'bg-green-500' :
                                                    'bg-yellow-500'
                                            }`}
                                        style={{ width: `${Math.min(totalWeight * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {remainingWeight <= 0 && (
                                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        <strong>Perhatian:</strong> Total bobot sudah mencapai atau melebihi 100%.
                                        Anda perlu mengurangi bobot kriteria yang ada sebelum menambah kriteria baru.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Criteria Grid */}
                {criteria.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {criteria.map((criterion) => (
                            <Card key={criterion.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group p-0 overflow-hidden min-h-[260px]">
                                <CardHeader className="flex flex-col items-start gap-3 px-6 pt-6 pb-2">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mb-2">
                                        <Scale className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                        {criterion.name}
                                    </CardTitle>
                                    <div className="flex gap-2 mb-1">
                                        <Badge variant={criterion.type === 'benefit' ? 'default' : 'secondary'} className="text-xs px-2 py-1">
                                            {criterion.type === 'benefit' ? 'Benefit' : 'Cost'}
                                        </Badge>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Bobot: {criterion.weight}</span>
                                    </div>
                                    {criterion.description && (
                                        <CardDescription className="whitespace-normal break-words line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                            {criterion.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <div className="border-t border-neutral-100 dark:border-neutral-800 mt-2" />
                                <CardContent className="flex flex-col gap-3 px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-xs px-2 py-1">
                                            {criterion.evaluations_count} evaluasi
                                        </Badge>
                                        <span className="text-xs text-neutral-400">
                                            {new Date(criterion.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        <Link href={`/criteria/${criterion.id}`}>
                                            <Button variant="outline" size="sm" className="border-neutral-200 dark:border-neutral-700">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/criteria/${criterion.id}/edit`}>
                                            <Button variant="outline" size="sm" className="border-neutral-200 dark:border-neutral-700">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(criterion.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-neutral-200 dark:border-neutral-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Scale className="w-16 h-16 text-neutral-400 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                                Belum ada kriteria
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
                                Mulai dengan menambahkan kriteria penilaian untuk sistem penunjang keputusan.
                            </p>
                            <Link href="/criteria/create">
                                <Button className="bg-green-600 hover:bg-green-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Kriteria Pertama
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
