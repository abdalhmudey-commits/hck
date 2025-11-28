'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BookText } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const { t, isHydrated } = useLanguage();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const navItems = [
    { href: '/', labelKey: 'nav_habits', icon: Home },
    { href: '/adhkar', labelKey: 'nav_adhkar', icon: BookOpen },
    { href: '/summaries', labelKey: 'nav_summaries', icon: BookText },
  ];

  const isLinkActive = (href: string) => {
    // Exact match for the homepage
    if (href === '/') {
      return pathname === basePath || pathname === `${basePath}/`;
    }
    // For other pages, check if the pathname ends with the href
    return pathname === `${basePath}${href}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto grid h-full max-w-lg grid-cols-3 font-medium">
        {navItems.map((item) => {
          const isActive = isLinkActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-muted',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="mb-1 h-6 w-6" />
              <span className="text-xs">{isHydrated ? t(item.labelKey) : item.labelKey.split('_')[1]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
