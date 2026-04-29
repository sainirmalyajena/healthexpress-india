'use client';

import { usePathname } from 'next/navigation';

export function ConditionalShell({ 
  children, 
  showOn = 'main' 
}: { 
  children: React.ReactNode;
  showOn: 'main' | 'prism';
}) {
  const pathname = usePathname();
  const isPrism = pathname?.includes('/prism');
  
  if (showOn === 'main' && isPrism) return null;
  if (showOn === 'prism' && !isPrism) return null;
  
  return <>{children}</>;
}
