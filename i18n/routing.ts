import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ar'],

  defaultLocale: 'en'
});

// تغليف خفيف حول واجهات برمجة تطبيقات التنقل الخاصة بـ Next.js
// التي ستأخذ في الاعتبار تكوين التوجيه
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
