'use client';
import { useParams } from 'next/navigation';
import LessonView from '@/components/LessonView';
import Shell from '@/components/Shell';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <Shell title="Bài học">
      <LessonView id={id} />
    </Shell>
  );
}
