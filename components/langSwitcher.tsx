"use client"

import * as React from "react"
import { ChangeEvent, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
 
export function LangToggle() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(`/${nextLocale}`);
    });
  };

  return (
    <div>
       
        <Button variant="outline">{localActive === "ar" ? "العربية" : "English"}</Button>
       
      <div className="w-30">
        <div onValueChange={(value) => {
            onSelectChange({ target: { value } } as ChangeEvent<HTMLSelectElement>);
          }}>  </div>
          
          <Button value="ar">العربية</Button>
          <Button value="en">English</Button>
      
      </div>
    </div>
  )
}
