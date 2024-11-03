"use client"

import * as React from "react"
import { ChangeEvent, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from "@/components/ui/button"
import { PiTranslate } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LangToggle({ isMobile }: { isMobile: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const localActive = useLocale();
  const locale = useLocale();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;

    // Get the current path segments
    const segments = pathname.split('/');

    // Replace the locale segment (index 1) with the new locale
    segments[1] = nextLocale;

    // Reconstruct the full path
    const newPath = segments.join('/');

    startTransition(() => {
      router.replace(newPath);
    });
  };

  if (isMobile) return (
    <div className="flex gap-2 items-center">
      <Button
        size={'lg'}
        className="h-full"
        onClick={() => onSelectChange({ target: { value: localActive === "ar" ? "en" : "ar" } } as ChangeEvent<HTMLSelectElement>)}>
        <PiTranslate size={20} />
        {localActive === "en" ? "العربية" : "English"}
      </Button>

    </div>
  );
  if (!isMobile) return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{localActive === "ar" ? "العربية" : "English"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-30">
        <DropdownMenuRadioGroup
          onValueChange={(value) => {
            onSelectChange({ target: { value } } as ChangeEvent<HTMLSelectElement>);
          }}>
          <DropdownMenuRadioItem value="ar">العربية</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
