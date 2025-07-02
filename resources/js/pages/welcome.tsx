import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                {/* Hero Section */}
                <header className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-12 flex flex-col-reverse lg:flex-row items-center gap-12">
                    {/* Left: Text */}
                    <div className="flex-1 flex flex-col items-start gap-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight">
                            Sistem Pendukung Keputusan <span className="text-blue-600">TOPSIS</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-xl">
                            Temukan solusi terbaik dengan metode TOPSIS. Input data, evaluasi, dan dapatkan hasil peringkat alternatif secara otomatis dan visual.
                        </p>
                        <div className="flex gap-4 mt-2">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-md">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-semibold">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-md">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Right: Illustration */}
                    <div className="flex-1 flex items-center justify-center">
                        <svg width="380" height="320" viewBox="0 0 380 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
                            <ellipse cx="190" cy="160" rx="180" ry="120" fill="url(#paint0_radial)" />
                            <rect x="60" y="80" width="260" height="160" rx="32" fill="#fff" className="dark:fill-neutral-900" stroke="#3B82F6" strokeWidth="2" />
                            <rect x="100" y="120" width="60" height="40" rx="12" fill="#3B82F6" fillOpacity="0.8" />
                            <rect x="180" y="120" width="60" height="40" rx="12" fill="#6366F1" fillOpacity="0.8" />
                            <rect x="140" y="180" width="100" height="40" rx="12" fill="#06B6D4" fillOpacity="0.8" />
                            <defs>
                                <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="translate(190 160) scale(180 120)" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#3B82F6" stopOpacity="0.15" />
                                    <stop offset="1" stopColor="#6366F1" stopOpacity="0.05" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </header>

                {/* Fitur Section */}
                <section className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-8 text-center">Fitur Unggulan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center gap-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
                            <svg className="w-10 h-10 text-blue-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6l4 2" /></svg>
                            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">Penilaian Alternatif</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Input dan kelola alternatif yang akan dievaluasi secara mudah dan cepat.</p>
                        </div>
                        <div className="flex flex-col items-center gap-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
                            <svg className="w-10 h-10 text-green-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 17l4-4 4 4m0 0V7m0 10H8" /></svg>
                            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">Kriteria Dinamis</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Atur kriteria penilaian, bobot, dan tipe (benefit/cost) sesuai kebutuhan.</p>
                        </div>
                        <div className="flex flex-col items-center gap-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
                            <svg className="w-10 h-10 text-purple-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18" /></svg>
                            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">Evaluasi Matriks</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Input nilai evaluasi dalam bentuk matriks, mudah dan efisien.</p>
                        </div>
                        <div className="flex flex-col items-center gap-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
                            <svg className="w-10 h-10 text-orange-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z" /></svg>
                            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">Visualisasi & Hasil</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Lihat hasil perhitungan dan visualisasi data secara interaktif.</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                    &copy; {new Date().getFullYear()} SPK TOPSIS. Dibuat dengan ❤️ oleh Gusti Randa.
                </footer>
            </div>
        </>
    );
}
