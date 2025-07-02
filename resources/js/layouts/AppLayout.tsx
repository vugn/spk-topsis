import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Home,
    Target,
    Scale,
    BarChart3,
    Calculator,
    Bell,
    Settings
} from 'lucide-react';

interface AppLayoutProps {
    children: ReactNode;
}

interface MenuItem {
    name: string;
    href: string;
    icon: ReactNode;
    current?: boolean;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { url } = usePage();

    const navigation: MenuItem[] = [
        { name: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" />, current: url === '/dashboard' },
        { name: 'Alternatif', href: '/alternatives', icon: <Target className="w-5 h-5" />, current: url.startsWith('/alternatives') },
        { name: 'Kriteria', href: '/criteria', icon: <Scale className="w-5 h-5" />, current: url.startsWith('/criteria') },
        { name: 'Evaluasi', href: '/evaluations', icon: <BarChart3 className="w-5 h-5" />, current: url.startsWith('/evaluations') },
        { name: 'TOPSIS', href: '/topsis', icon: <Calculator className="w-5 h-5" />, current: url.startsWith('/topsis') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg">
                <div className="flex h-16 shrink-0 items-center px-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        SPK TOPSIS
                    </h1>
                </div>
                <nav className="mt-8 flex-1 px-4 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                item.current
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                            )}
                        >
                            {item.icon}
                            <span className="ml-3">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main content */}
            <div className="pl-64">
                {/* Top header */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-x-6 sm:px-6 lg:px-8">
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1 items-center">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Sistem Penunjang Keputusan - TOPSIS
                            </h2>
                        </div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <Button variant="ghost" size="sm">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Settings className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-8 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
