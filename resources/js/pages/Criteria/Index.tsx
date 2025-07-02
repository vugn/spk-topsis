import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
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

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kriteria</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {criteria.map((criterion) => (
                            <Card key={criterion.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Scale className="w-5 h-5 text-green-600" />
                                            <CardTitle className="text-lg">{criterion.name}</CardTitle>
                                        </div>
                                        <div className="flex flex-col items-end space-y-1">
                                            <Badge variant={criterion.type === 'benefit' ? 'default' : 'secondary'}>
                                                {criterion.type === 'benefit' ? 'Benefit' : 'Cost'}
                                            </Badge>
                                            <span className="text-sm text-gray-600 font-medium">
                                                Bobot: {criterion.weight}
                                            </span>
                                        </div>
                                    </div>
                                    {criterion.description && (
                                        <CardDescription className="mt-2">
                                            {criterion.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Badge variant="outline">
                                                {criterion.evaluations_count} evaluasi
                                            </Badge>
                                            <span className="text-sm text-gray-500">
                                                {new Date(criterion.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link href={`/criteria/${criterion.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/criteria/${criterion.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(criterion.id)}
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
                            <Scale className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Belum ada kriteria
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
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
