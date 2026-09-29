import { cn } from '@/lib/utils';

export function SectionTitle({ eyebrow, title, description, light = false, align = 'right', className }: { eyebrow: string; title: React.ReactNode; description?: string; light?: boolean; align?: 'right' | 'center'; className?: string }) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      <span className={cn('eyebrow mb-4', light && 'eyebrow-on-dark', align === 'center' && 'justify-center')}>{eyebrow}</span>
      <h2 className={cn('display-title text-balance', light ? 'text-white' : 'text-navy-900')}>{title}</h2>
      {description && <p className={cn('mt-5 leading-[2]', light ? 'text-white/65' : 'text-gray-600')}>{description}</p>}
    </div>
  );
}
