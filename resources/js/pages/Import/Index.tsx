import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Upload,
    Download,
    Users,
    Scale,
    BarChart3,
    CheckCircle,
    AlertCircle,
    FileSpreadsheet
} from 'lucide-react';
import { useState } from 'react';

interface PageProps {
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function Index() {
    const page = usePage<PageProps>();
    const [activeTab, setActiveTab] = useState('alternatives');

    const alternativesForm = useForm({
        file: null as File | null
    });

    const criteriaForm = useForm({
        file: null as File | null
    });

    const evaluationsForm = useForm({
        file: null as File | null
    });

    const handleFileUpload = (form: typeof alternativesForm, endpoint: string) => {
        form.post(route(endpoint), {
            forceFormData: true,
            onSuccess: () => {
                form.reset();
            }
        });
    };

    const downloadTemplate = (type: string) => {
        window.location.href = route('import.template', type);
    };

    const tabs = [
        {
            id: 'alternatives',
            label: 'Alternatif',
            icon: Users,
            description: 'Import data alternatif dari file Excel'
        },
        {
            id: 'criteria',
            label: 'Kriteria',
            icon: Scale,
            description: 'Import data kriteria beserta bobot dari file Excel'
        },
        {
            id: 'evaluations',
            label: 'Evaluasi',
            icon: BarChart3,
            description: 'Import matriks evaluasi dari file Excel'
        }
    ];

    const renderImportCard = (type: string, form: typeof alternativesForm, endpoint: string, templateType: string) => {
        const isProcessing = form.processing;

        return (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5" />
                        Import {type}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Template Download */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                                    Download Template Excel
                                </h4>
                                <p className="text-sm text-blue-700 dark:text-blue-200">
                                    Unduh template untuk memastikan format data yang benar
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadTemplate(templateType)}
                                className="border-blue-200 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-200"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Template
                            </Button>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label htmlFor={`file-${templateType}`}>File Excel (.xlsx, .xls, .csv)</Label>
                        <Input
                            id={`file-${templateType}`}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => form.setData('file', e.target.files?.[0] || null)}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {form.errors.file && (
                            <p className="text-sm text-red-600">{form.errors.file}</p>
                        )}
                    </div>

                    {/* Upload Button */}
                    <Button
                        onClick={() => handleFileUpload(form, endpoint)}
                        disabled={!form.data.file || isProcessing}
                        className="w-full"
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Mengimpor...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Import {type}
                            </>
                        )}
                    </Button>

                    {/* Help Text */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>• Maksimal ukuran file: 2MB</p>
                        <p>• Format yang didukung: .xlsx, .xls, .csv</p>
                        <p>• Pastikan menggunakan template yang disediakan</p>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout>
            <Head title="Import Data" />

            <div className="max-w-screen-xl mx-auto px-4 md:px-8 mt-10">
                <div className="min-h-screen bg-white dark:bg-neutral-950 p-6 -m-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                            Import Data Excel
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-300 mt-2">
                            Import data alternatif, kriteria, dan evaluasi dari file Excel
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {page.props.flash?.success && (
                        <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800 dark:text-green-200">
                                {page.props.flash.success}
                            </AlertDescription>
                        </Alert>
                    )}

                    {page.props.flash?.error && (
                        <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800 dark:text-red-200">
                                {page.props.flash.error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Tabs */}
                    <div className="border-b border-neutral-200 dark:border-neutral-700 mb-6">
                        <div className="flex space-x-8">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="max-w-2xl">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={activeTab === tab.id ? 'block' : 'hidden'}
                            >
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                                        {tab.label}
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-300">
                                        {tab.description}
                                    </p>
                                </div>

                                {tab.id === 'alternatives' && renderImportCard(
                                    'Alternatif',
                                    alternativesForm,
                                    'import.alternatives',
                                    'alternatives'
                                )}

                                {tab.id === 'criteria' && renderImportCard(
                                    'Kriteria',
                                    criteriaForm,
                                    'import.criteria',
                                    'criteria'
                                )}

                                {tab.id === 'evaluations' && (
                                    <>
                                        <Alert className="mb-4 border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                                            <AlertCircle className="h-4 w-4 text-amber-600" />
                                            <AlertDescription className="text-amber-800 dark:text-amber-200">
                                                <strong>Penting:</strong> Pastikan data alternatif dan kriteria sudah diimpor terlebih dahulu sebelum mengimpor evaluasi.
                                            </AlertDescription>
                                        </Alert>
                                        {renderImportCard(
                                            'Evaluasi',
                                            evaluationsForm,
                                            'import.evaluations',
                                            'evaluations'
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <Card className="mt-8 max-w-2xl">
                        <CardHeader>
                            <CardTitle>Panduan Import Data</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
                                <div>
                                    <h4 className="font-medium">Download Template</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Unduh template Excel untuk memastikan format data yang benar</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
                                <div>
                                    <h4 className="font-medium">Isi Data</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Isi data sesuai dengan format template yang telah disediakan</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
                                <div>
                                    <h4 className="font-medium">Upload File</h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Upload file Excel yang sudah diisi dan tunggu proses import selesai</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
