import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Target,
    Edit,
    Download,
    FileText,
    Eye
} from 'lucide-react';

interface Evaluation {
    id: number;
    value: number;
    criterion: {
        id: number;
        name: string;
        type: string;
    };
}

interface EvidenceFile {
    name: string;
    original_name: string;
    size: number;
    mime_type: string;
    url: string;
    uploaded_at: string;
}

interface Alternative {
    id: number;
    name: string;
    description?: string;
    evaluations: Evaluation[];
    created_at: string;
    updated_at: string;
}

interface Props {
    alternative: Alternative;
    evidenceFiles: EvidenceFile[];
}

export default function Show({ alternative, evidenceFiles }: Props) {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return '🖼️';
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('word')) return '📝';
        return '📎';
    };

    return (
        <AppLayout>
            <Head title={alternative.name} />

            <div className="max-w-screen-xl mx-auto px-4 md:px-8 space-y-6 mt-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/alternatives">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">{alternative.name}</h1>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                                Detail informasi alternatif
                            </p>
                        </div>
                    </div>
                    <Link href={`/alternatives/${alternative.id}/edit`}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Alternatif
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Alternative Information */}
                    <div className="space-y-6">
                        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">Informasi Alternatif</CardTitle>
                                        <CardDescription>Detail informasi alternatif</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Nama</Label>
                                    <p className="text-lg font-semibold text-neutral-900 dark:text-white">{alternative.name}</p>
                                </div>

                                {alternative.description && (
                                    <div>
                                        <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Deskripsi</Label>
                                        <p className="text-neutral-900 dark:text-white whitespace-pre-wrap">{alternative.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Jumlah Evaluasi</Label>
                                        <p className="text-lg font-semibold text-neutral-900 dark:text-white">{alternative.evaluations.length}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">File Bukti</Label>
                                        <p className="text-lg font-semibold text-neutral-900 dark:text-white">{evidenceFiles.length}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Dibuat</Label>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {new Date(alternative.created_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Terakhir Diupdate</Label>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {new Date(alternative.updated_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Evaluations */}
                        {alternative.evaluations.length > 0 && (
                            <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-neutral-900 dark:text-white">Data Evaluasi</CardTitle>
                                    <CardDescription>Nilai evaluasi untuk setiap kriteria</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {alternative.evaluations.map((evaluation) => (
                                            <div key={evaluation.id} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-neutral-900 dark:text-white">{evaluation.criterion.name}</p>
                                                        <Badge variant={evaluation.criterion.type === 'benefit' ? 'default' : 'secondary'} className="text-xs">
                                                            {evaluation.criterion.type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-neutral-900 dark:text-white">{evaluation.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Evidence Files */}
                    <div>
                        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">File Bukti</CardTitle>
                                        <CardDescription>File pendukung untuk alternatif ini</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {evidenceFiles.length > 0 ? (
                                    <div className="space-y-3">
                                        {evidenceFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{getFileIcon(file.mime_type)}</span>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-neutral-900 dark:text-white">{file.original_name}</p>
                                                        <p className="text-sm text-neutral-500">
                                                            {formatFileSize(file.size)} • {new Date(file.uploaded_at).toLocaleDateString('id-ID')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(file.url, '_blank')}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Lihat
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(route('alternatives.evidence.download', [alternative.id, file.name]), '_blank')}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                                        <p className="text-neutral-600 dark:text-neutral-400">Belum ada file bukti</p>
                                        <p className="text-sm text-neutral-500">File bukti dapat ditambahkan melalui halaman edit</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
    return <span className={className}>{children}</span>;
}
