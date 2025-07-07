import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Target,
    Scale,
    BarChart3,
    Calculator,
    TrendingUp,
    Upload
} from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Alternatif',
        href: '/alternatives',
        icon: Target,
    },
    {
        title: 'Kriteria',
        href: '/criteria',
        icon: Scale,
    },
    {
        title: 'Evaluasi',
        href: '/evaluations',
        icon: BarChart3,
    },
    {
        title: 'Import Data',
        href: '/import',
        icon: Upload,
    },
    {
        title: 'Hasil TOPSIS',
        href: '/topsis',
        icon: Calculator,
    },
    {
        title: 'Grafik',
        href: '/topsis/charts',
        icon: TrendingUp,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">SPK TOPSIS</span>
                                    <span className="truncate text-xs">Sistem Penunjang Keputusan</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
