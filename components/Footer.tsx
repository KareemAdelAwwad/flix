'use client';

import React from 'react';
import links from '@/data/links.json';
import { Link } from '@/i18n/routing';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const year = new Date().getFullYear();
  const navItemsClassName = 'text-gray-60';
  const t = useTranslations('Footer');

  const socialMediaIcon =
    'p-2 rounded-md bg-gray-75 dark:bg-black-10 hover:scale-95 transition-transform duration-300 border-[1px] dark:border-black-15 text-black-10 dark:text-white';

  return (
    <footer className="container flex justify-center flex-col items-center mt-14">
      <div className="flex flex-wrap items-start justify-between w-full gap-8 py-10">
        {links.footer.map((section) => (
          <div key={section.key} className="flex flex-col text-lg">
            <h2 className="dark:text-white text-black-6">{t(section.key)}</h2>
            {section.links.map((link) => (
              <Link key={link.key} href={link.path} className={navItemsClassName}>
                {t(link.key)}
              </Link>
            ))}
          </div>
        ))}

        <div className="flex flex-col text-lg">
          <h2 className="dark:text-white text-black-6">{t('ContactWithUs')}</h2>
          <div className="flex justify-evenly gap-2">
            <Link className={socialMediaIcon} href="#" aria-label="Facebook">
              <FaFacebook size={22} />
            </Link>
            <Link className={socialMediaIcon} href="#" aria-label="LinkedIn">
              <FaLinkedin size={22} />
            </Link>
            <Link className={socialMediaIcon} href="#" aria-label="Twitter">
              <FaXTwitter size={22} />
            </Link>
          </div>
        </div>
      </div>

      <hr className="w-full border-gray-70" />
      <div className="w-full m-auto flex flex-col justify-between items-center lg:flex-row">
        <p className="text-gray-65 py-4">
          © {t('Rights')} {year}
        </p>

        <div className="flex items-center justify-center text-gray-65 gap-8">
          <Link href="">{t('Terms')}</Link>
          <Link href="">{t('Privacy')}</Link>
          <Link href="">{t('Cookie')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
