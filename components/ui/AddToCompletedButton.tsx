'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useUserListsStore } from '@/store';
import { Button } from '@/components/ui/button';
import ReadyTooltip from '@/components/ui/ready-tooltip';
import { GoCheckCircle, GoCheckCircleFill } from 'react-icons/go';
import { useLocale } from 'next-intl';

interface CompletedButtonProps {
  titleId: string;
  titleType: 'movie' | 'tv';
  style: 'icon' | 'text' | 'badge';
  className?: string;
}

const strings = {
  en: {
    add: 'Watched',
    remove: 'Not Watched Yet',
  },
  ar: {
    add: 'شاهدته',
    remove: 'لم اشاهده بعد',
  },
};

const CompletedButton: React.FC<CompletedButtonProps> = React.memo(
  ({ titleId, titleType, style, className }) => {
    const { userId } = useAuth();
    const locale = useLocale();
    const key = titleId ? `${titleType}:${titleId}` : '';

    const isInCompleted = useUserListsStore((state) =>
      key ? state.completedSet.has(key) : false
    );
    const toggleCompleted = useUserListsStore((state) => state.toggleCompleted);

    const label = useMemo(() => {
      const lang = locale === 'ar' ? strings.ar : strings.en;
      return isInCompleted ? lang.remove : lang.add;
    }, [isInCompleted, locale]);

    const handleAddToCompleted = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!userId || !titleId) return;
      try {
        await toggleCompleted(userId, titleId, titleType);
      } catch (error) {
        console.error('Failed to update completed:', error);
        alert('Failed to update completed');
      }
    };

    if (style === 'icon') {
      return (
        <ReadyTooltip title={label}>
          <Button onClick={handleAddToCompleted} size="lgIcon" className={className} aria-label={label}>
            {isInCompleted ? <GoCheckCircleFill size={24} /> : <GoCheckCircle size={24} />}
          </Button>
        </ReadyTooltip>
      );
    }

    if (style === 'text') {
      return (
        <Button onClick={handleAddToCompleted} size="default" className={className}>
          {isInCompleted ? <GoCheckCircleFill size={24} /> : <GoCheckCircle size={24} />}
          {label}
        </Button>
      );
    }

    if (style === 'badge') {
      return (
        <Button
          onClick={handleAddToCompleted}
          size="lgIcon"
          aria-label={label}
          className={`-top-1 left-2 absolute w-8 rounded-none rounded-b z-10 ${className ?? ''}`}
        >
          {isInCompleted ? (
            <GoCheckCircleFill className="dark:text-white text-black-12" size={32} />
          ) : (
            <GoCheckCircle className="dark:text-white text-black-12" size={32} />
          )}
        </Button>
      );
    }

    return null;
  }
);

CompletedButton.displayName = 'CompletedButton';

export default CompletedButton;