import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Scale
} from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        weight: '',
        type: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/criteria');
    };

    return (
        <AppLayout>
            <Head title="Tambah Kriteria" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link href="/criteria">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tambah Kriteria</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Tambahkan kriteria penilaian baru untuk sistem penunjang keputusan
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Scale className="w-5 h-5 text-green-600" />
                                <CardTitle>Informasi Kriteria</CardTitle>
                            </div>
                            <CardDescription>
                                Masukkan informasi detail untuk kriteria penilaian baru
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Kriteria *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Masukkan nama kriteria"
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
                                        placeholder="Masukkan deskripsi kriteria (opsional)"
                                        rows={4}
                                        className={errors.description ? 'border-red-500' : ''}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Bobot Kriteria *</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            step="0.0001"
                                            min="0"
                                            max="1"
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                            placeholder="0.0000"
                                            className={errors.weight ? 'border-red-500' : ''}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Nilai antara 0 dan 1 (contoh: 0.25)
                                        </p>
                                        {errors.weight && (
                                            <p className="text-sm text-red-600">{errors.weight}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipe Kriteria *</Label>
                                        <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Pilih tipe kriteria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="benefit">
                                                    Benefit (Semakin besar semakin baik)
                                                </SelectItem>
                                                <SelectItem value="cost">
                                                    Cost (Semakin kecil semakin baik)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.type && (
                                            <p className="text-sm text-red-600">{errors.type}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                        Informasi Tipe Kriteria:
                                    </h4>
                                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                        <li><strong>Benefit:</strong> Nilai yang lebih tinggi lebih diinginkan (contoh: kualitas, kecepatan)</li>
                                        <li><strong>Cost:</strong> Nilai yang lebih rendah lebih diinginkan (contoh: harga, waktu tunggu)</li>
                                    </ul>
                                </div>

                                <div className="flex items-center space-x-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Kriteria'}
                                    </Button>
                                    <Link href="/criteria">
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
