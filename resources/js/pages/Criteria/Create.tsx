import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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

interface Props {
    totalWeight: number;
    remainingWeight: number;
}

export default function Create({ totalWeight, remainingWeight }: Props) {
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

            <div className="max-w-screen-xl mx-auto px-4 md:px-8 space-y-6 mt-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/criteria">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Tambah Kriteria</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Tambahkan kriteria penilaian baru untuk sistem penunjang keputusan
                        </p>
                    </div>
                </div>

                {/* Weight Info */}
                {totalWeight > 0 && (
                    <div className="max-w-2xl">
                        <div className={`p-4 rounded-lg border ${remainingWeight <= 0 ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={`font-medium ${remainingWeight <= 0 ? 'text-red-900 dark:text-red-100' : 'text-blue-900 dark:text-blue-100'}`}>
                                    Status Bobot Kriteria
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className={remainingWeight <= 0 ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}>Total Saat Ini: </span>
                                    <span className="font-bold">{(totalWeight * 100).toFixed(2)}%</span>
                                </div>
                                <div>
                                    <span className={remainingWeight <= 0 ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}>Sisa Bobot: </span>
                                    <span className={`font-bold ${remainingWeight <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {(remainingWeight * 100).toFixed(2)}%
                                    </span>
                                </div>
                                <div>
                                    <span className={remainingWeight <= 0 ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}>Maksimal: </span>
                                    <span className="font-bold">{Math.max(0, remainingWeight * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                            {remainingWeight <= 0 && (
                                <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/40 rounded border">
                                    <p className="text-sm text-red-800 dark:text-red-200">
                                        <strong>Peringatan:</strong> Total bobot sudah mencapai 100%. Anda perlu mengurangi bobot kriteria yang ada terlebih dahulu.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="max-w-2xl">
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-0 overflow-hidden">
                        <CardHeader className="flex flex-col items-start gap-3 px-6 pt-6 pb-2">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mb-2">
                                <Scale className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">Informasi Kriteria</CardTitle>
                            <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                Masukkan informasi detail untuk kriteria penilaian baru
                            </CardDescription>
                        </CardHeader>
                        <div className="border-t border-neutral-100 dark:border-neutral-800 mt-2" />
                        <CardContent className="px-6 py-6">
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
                                            max={Math.max(0, remainingWeight)}
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                            placeholder="0.0000"
                                            className={errors.weight ? 'border-red-500' : ''}
                                        />
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">
                                                Nilai antara 0 dan {Math.max(0, remainingWeight).toFixed(4)} (maksimal yang tersisa)
                                            </p>
                                            {data.weight && (
                                                <p className={`text-xs ${parseFloat(data.weight) > remainingWeight ? 'text-red-500' :
                                                        parseFloat(data.weight) > 0 ? 'text-green-600' : 'text-gray-500'
                                                    }`}>
                                                    Persentase: {(parseFloat(data.weight || '0') * 100).toFixed(2)}%
                                                    {parseFloat(data.weight) > remainingWeight && ' (Melebihi batas!)'}
                                                </p>
                                            )}
                                        </div>
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
