// app/components/ThemeSwitcher.tsx
"use client";
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {useTranslations} from 'next-intl';
 
export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const t = useTranslations('ThemeToggle');


  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className=" m-auto w-fit bg-red-60 flex justify-evenly  rounded-lg">
 
        
          
      <Button className= " text-black-10 bg-white    dark:text-white dark:bg-transparent hover:bg-white" onClick={() => setTheme('light')}> <Sun  /> {t('light')}</Button>
  
      <Button className="text-white   bg-transparent  dark:bg-black-10 hover:bg-transparent"  onClick={() => setTheme('dark')}>  <Moon /> {t('dark')} </Button>
    </div>
  )
};