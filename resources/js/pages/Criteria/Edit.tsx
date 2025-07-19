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

interface Criterion {
    id: number;
    name: string;
    description?: string;
    weight: number;
    type: 'benefit' | 'cost';
}

interface Props {
    criterion: Criterion;
    totalWeight: number;
    remainingWeight: number;
}

export default function Edit({ criterion, totalWeight, remainingWeight }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: criterion.name,
        description: criterion.description || '',
        weight: criterion.weight.toString(),
        type: criterion.type,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/criteria/${criterion.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit ${criterion.name}`} />

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
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Edit Kriteria</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Edit informasi kriteria: {criterion.name}
                        </p>
                    </div>
                </div>

                {/* Weight Info */}
                <div className="max-w-2xl">
                    <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-blue-900 dark:text-blue-100">
                                Status Bobot Kriteria
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-blue-700 dark:text-blue-300">Bobot Saat Ini: </span>
                                <span className="font-bold">{(criterion.weight * 100).toFixed(2)}%</span>
                            </div>
                            <div>
                                <span className="text-blue-700 dark:text-blue-300">Total Lainnya: </span>
                                <span className="font-bold">{(totalWeight * 100).toFixed(2)}%</span>
                            </div>
                            <div>
                                <span className="text-blue-700 dark:text-blue-300">Sisa Tersedia: </span>
                                <span className="font-bold text-green-600">{(remainingWeight * 100).toFixed(2)}%</span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-0 overflow-hidden">
                        <CardHeader className="flex flex-col items-start gap-3 px-6 pt-6 pb-2">
                            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mb-2">
                                <Scale className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white">Informasi Kriteria</CardTitle>
                            <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                Update informasi untuk kriteria penilaian ini
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
                                            max={remainingWeight + criterion.weight}
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                            placeholder="0.0000"
                                            className={errors.weight ? 'border-red-500' : ''}
                                        />
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500">
                                                Nilai antara 0 dan {Number((remainingWeight + criterion.weight)).toFixed(4)} (maksimal yang bisa diset)
                                            </p>
                                            {data.weight && (
                                                <p className={`text-xs ${parseFloat(data.weight) > (remainingWeight + criterion.weight) ? 'text-red-500' :
                                                    parseFloat(data.weight) > 0 ? 'text-green-600' : 'text-gray-500'
                                                    }`}>
                                                    Persentase: {(parseFloat(data.weight || '0') * 100).toFixed(2)}%
                                                    {parseFloat(data.weight) > (remainingWeight + criterion.weight) && ' (Melebihi batas!)'}
                                                </p>
                                            )}
                                        </div>
                                        {errors.weight && (
                                            <p className="text-sm text-red-600">{errors.weight}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipe Kriteria *</Label>
                                        <Select value={data.type} onValueChange={(value: 'benefit' | 'cost') => setData('type', value)}>
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
                                        {processing ? 'Menyimpan...' : 'Update Kriteria'}
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
