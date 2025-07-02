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
    Eye
} from 'lucide-react';

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
}

export default function Index({ criteria }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kriteria ini?')) {
            router.delete(`/criteria/${id}`);
        }
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
                    <Link href="/criteria/create">
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Kriteria
                        </Button>
                    </Link>
                </div>

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
