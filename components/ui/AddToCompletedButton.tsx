import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { addToCompleted } from '@/lib/AddToCompleted';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import ReadyTooltip from '@/components/ui/ready-tooltip';
import { GoCheckCircle, GoCheckCircleFill  } from "react-icons/go";

import { useLocale } from 'next-intl';

interface CompletedButtonProps {
  titleId: string;
  titleType: "movie" | "tv";
  style: "icon" | "text" | "badge";
  className?: string;
}

const CompletedButton: React.FC<CompletedButtonProps> = ({ titleId, titleType, style, className }) => {
  const { userId } = useAuth();
  const locale = useLocale();
  const strings = {
    en: {
      add: 'Watched',
      remove: 'Not Watched Yet'
    },
    ar: {
      add: 'شاهدته',
      remove: 'لم اشاهده بعد'
    }
  };
  const [isInCompleted, setIsInCompleted] = useState(false);

  useEffect(() => {
    const checkCompleted = async () => {
      if (!userId) return;

      const completedRef = db.collection('Completed');
      const existingEntry = await completedRef
        .where('userId', '==', userId)
        .where('titleId', '==', titleId)
        .where('titleType', '==', titleType)
        .get();

      setIsInCompleted(!existingEntry.empty);
    };

    checkCompleted();
  }, [userId, titleId, titleType]);

  const handleAddToCompleted = async () => {
    try {
      if (userId) {
        await addToCompleted(userId, titleId, titleType);
        setIsInCompleted(prev => !prev);
      }
    } catch (error) {
      console.error('Failed to update completed:', error);
      alert('Failed to update completed');
    }
  };

  return (
    style === 'icon' ? (
      <ReadyTooltip
        children={<Button onClick={handleAddToCompleted} size={'lgIcon'} className={className}>
          {
            isInCompleted ? <GoCheckCircleFill size={24} /> : <GoCheckCircle size={24} />
          }
        </Button>}
        title={isInCompleted ? (locale === 'ar' ? strings.ar.remove : strings.en.remove)
          : (locale === 'ar' ? strings.ar.add : strings.en.add)} />
    ) : style === 'text' ? (
      <Button onClick={handleAddToCompleted} size={"default"} className={className}>
        {
          isInCompleted ? <GoCheckCircleFill size={24} /> : <GoCheckCircle size={24} />
        }
        {isInCompleted ? (locale === 'ar' ? strings.ar.remove : strings.en.remove)
          : (locale === 'ar' ? strings.ar.add : strings.en.add)}
      </Button>
    ) : style === 'badge' ? (
      <Button onClick={handleAddToCompleted} size={"lgIcon"}
        className={`-top-1 left-2 absolute w-8 rounded-none rounded-b z-10 ${className}`} >
        {
          isInCompleted ? <GoCheckCircleFill size={32} /> : <GoCheckCircle size={32} />
        }
      </Button>
    ) : null
  );
};

export default CompletedButton;