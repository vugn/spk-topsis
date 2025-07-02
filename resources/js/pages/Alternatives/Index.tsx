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
    Eye
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

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alternatif</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alternatives.map((alternative) => (
                            <Card key={alternative.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Target className="w-5 h-5 text-blue-600" />
                                            <CardTitle className="text-lg">{alternative.name}</CardTitle>
                                        </div>
                                        <Badge variant="secondary">
                                            {alternative.evaluations_count} evaluasi
                                        </Badge>
                                    </div>
                                    {alternative.description && (
                                        <CardDescription className="mt-2">
                                            {alternative.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            Dibuat: {new Date(alternative.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                        <div className="flex space-x-2">
                                            <Link href={`/alternatives/${alternative.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/alternatives/${alternative.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(alternative.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Target className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Belum ada alternatif
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
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
