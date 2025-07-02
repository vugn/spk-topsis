import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Target,
    Edit,
    Trash2,
} from 'lucide-react';

interface Alternative {
    id: number;
    name: string;
    description?: string;
    evaluations_count: number;
    created_at: string;
}

interface Props {
    alternatives: Alternative[];
}

export default function Index({ alternatives }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus alternatif ini?')) {
            router.delete(`/alternatives/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Alternatif" />

            <div className="max-w-screen-xl mx-auto px-4 md:px-8 space-y-6 mt-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Alternatif</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Kelola alternatif untuk sistem penunjang keputusan
                        </p>
                    </div>
                    <Link href="/alternatives/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Alternatif
                        </Button>
                    </Link>
                </div>

                {/* Alternatives Grid */}
                {alternatives.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {alternatives.map((alternative) => (
                            <Card key={alternative.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group p-0 overflow-hidden">
                                <CardHeader className="flex flex-col items-start gap-3 px-6 pt-6 pb-2">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mb-2">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                        {alternative.name}
                                    </CardTitle>
                                    <Badge variant="secondary" className="text-xs px-2 py-1 mb-1">
                                        {alternative.evaluations_count} evaluasi
                                    </Badge>
                                    {alternative.description && (
                                        <CardDescription className="whitespace-normal break-words line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                            {alternative.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <div className="border-t border-neutral-100 dark:border-neutral-800 mt-2" />
                                <CardContent className="flex flex-col gap-3 px-6 py-4">
                                    <span className="text-xs text-neutral-400">
                                        Dibuat: {new Date(alternative.created_at).toLocaleDateString('id-ID')}
                                    </span>
                                    <div className="flex gap-2 mt-1">
                                        <Link href={`/alternatives/${alternative.id}/edit`}>
                                            <Button variant="outline" size="sm" className="border-neutral-200 dark:border-neutral-700">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(alternative.id)}
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
                            <Target className="w-16 h-16 text-neutral-400 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                                Belum ada alternatif
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
                                Mulai dengan menambahkan alternatif pertama Anda untuk sistem penunjang keputusan.
                            </p>
                            <Link href="/alternatives/create">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Alternatif Pertama
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
