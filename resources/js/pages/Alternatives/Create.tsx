import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Target
} from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/alternatives');
    };

    return (
        <AppLayout>
            <Head title="Tambah Alternatif" />

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
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Tambah Alternatif</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Tambahkan alternatif baru untuk sistem penunjang keputusan
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
                                Masukkan informasi detail untuk alternatif baru
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
                                        {processing ? 'Menyimpan...' : 'Simpan Alternatif'}
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
            </div>
        </AppLayout>
    );
}
