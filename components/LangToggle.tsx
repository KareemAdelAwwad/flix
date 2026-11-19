'use client';

import * as React from 'react';
import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { PiTranslate } from 'react-icons/pi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LangToggle({ isMobile }: { isMobile: boolean }) {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const localActive = useLocale();

  const changeLocale = (nextLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    const newPath = segments.join('/');

    startTransition(() => {
      router.replace(newPath);
    });
  };

  if (isMobile) {
    return (
      <div className="flex gap-2 items-center">
        <Button
          size="lg"
          className="h-full"
          onClick={() => changeLocale(localActive === 'ar' ? 'en' : 'ar')}
        >
          <PiTranslate size={20} />
          {localActive === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{localActive === 'ar' ? 'العربية' : 'English'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuRadioGroup value={localActive} onValueChange={changeLocale}>
          <DropdownMenuRadioItem value="ar">العربية</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
