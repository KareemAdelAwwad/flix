// app/components/ThemeSwitcher.tsx
"use client";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useTranslations } from 'next-intl';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const t = useTranslations('ThemeToggle');


  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="bg-red-60 flex justify-evenly p-1 rounded-md">
      <Button className="w-full text-black-10 bg-white    dark:text-white dark:bg-transparent hover:bg-white" onClick={() => setTheme('light')}> <Sun /> {t('light')}</Button>
      <Button className="w-full text-white   bg-transparent  dark:bg-black-10 hover:bg-transparent" onClick={() => setTheme('dark')}>  <Moon /> {t('dark')} </Button>
    </div>
  )
};