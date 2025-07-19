import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    ArrowLeft,
    Target,
    Upload,
    Download,
    Trash2,
    FileText,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface Alternative {
    id: number;
    name: string;
    description?: string;
}

interface EvidenceFile {
    name: string;
    original_name: string;
    size: number;
    mime_type: string;
    url: string;
    uploaded_at: string;
}

interface Props {
    alternative: Alternative;
    evidenceFiles: EvidenceFile[];
}

export default function Edit({ alternative, evidenceFiles }: Props) {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploading, setUploading] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: alternative.name,
        description: alternative.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/alternatives/${alternative.id}`);
    };

    const handleFileUpload = () => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        setUploading(true);
        const formData = new FormData();

        Array.from(selectedFiles).forEach((file) => {
            formData.append('files[]', file);
        });

        router.post(`/alternatives/${alternative.id}/evidence`, formData, {
            forceFormData: true,
            onSuccess: () => {
                setSelectedFiles(null);
                // Reset file input
                const fileInput = document.getElementById('evidence-files') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            },
            onFinish: () => setUploading(false)
        });
    };

    const handleFileDelete = (fileName: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus file ini?')) return;

        router.delete(`/alternatives/${alternative.id}/evidence`, {
            data: { file_name: fileName }
        });
    };

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
            <Head title={`Edit ${alternative.name}`} />

            <div className="max-w-screen-xl mx-auto px-4 md:px-8 space-y-6 mt-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/alternatives">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Edit Alternatif</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Edit informasi alternatif: {alternative.name}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-0 overflow-hidden">
                        <CardHeader className="flex flex-col items-start gap-3 px-6 pt-6 pb-2">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mb-2">
                                <Target className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">Informasi Alternatif</CardTitle>
                            <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                Update informasi untuk alternatif ini
                            </CardDescription>
                        </CardHeader>
                        <div className="border-t border-neutral-100 dark:border-neutral-800 mt-2" />
                        <CardContent className="px-6 py-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Alternatif *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Masukkan nama alternatif"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                        placeholder="Masukkan deskripsi alternatif (opsional)"
                                        rows={4}
                                        className={`whitespace-normal break-words max-w-full${errors.description ? ' border-red-500' : ''}`}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {processing ? 'Menyimpan...' : 'Update Alternatif'}
                                    </Button>
                                    <Link href="/alternatives">
                                        <Button variant="outline">
                                            Batal
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Evidence Files Management */}
                <div className="max-w-2xl">
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">File Bukti</CardTitle>
                                    <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Upload file pendukung untuk alternatif ini (maksimal 5 file, 5MB per file)
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Upload Section */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="evidence-files">Upload File Bukti</Label>
                                    <Input
                                        id="evidence-files"
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                        onChange={(e) => setSelectedFiles(e.target.files)}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Format yang didukung: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT (Max: 5MB per file)
                                    </p>
                                </div>

                                {selectedFiles && selectedFiles.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">File yang dipilih:</p>
                                        <div className="space-y-1">
                                            {Array.from(selectedFiles).map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                                    <span className="text-sm">{file.name}</span>
                                                    <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={handleFileUpload}
                                            disabled={uploading || evidenceFiles.length >= 5}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Mengupload...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Upload File
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {evidenceFiles.length >= 5 && (
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Maksimal 5 file bukti per alternatif. Hapus file existing untuk menambah yang baru.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Existing Files */}
                            {evidenceFiles.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-neutral-900 dark:text-white">File Bukti yang Ada ({evidenceFiles.length}/5)</h4>
                                    <div className="space-y-2">
                                        {evidenceFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">{getFileIcon(file.mime_type)}</span>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{file.original_name}</p>
                                                        <p className="text-xs text-neutral-500">
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
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleFileDelete(file.name)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {evidenceFiles.length === 0 && (
                                <div className="text-center py-8">
                                    <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                                    <p className="text-neutral-600 dark:text-neutral-400">Belum ada file bukti yang diupload</p>
                                    <p className="text-sm text-neutral-500">Upload file pendukung untuk memperkuat alternatif ini</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
