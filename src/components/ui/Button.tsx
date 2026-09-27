import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const styles = {
  gold: 'bg-gold-500 text-navy-950 hover:bg-gold-300 shadow-gold',
  navy: 'bg-navy-900 text-white hover:bg-navy-800 shadow-lg shadow-navy-900/10',
  outline: 'border border-navy-900/15 bg-transparent text-navy-900 hover:border-gold-500 hover:text-gold-500',
  light: 'border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-navy-900',
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
  arrow?: boolean;
};

export function Button({ href, children, variant = 'gold', className, arrow = false }: ButtonProps) {
  const external = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:');
  const content = <>{children}{arrow && <ArrowLeft size={17} strokeWidth={1.8} />}</>;
  const classes = cn('group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-extrabold transition duration-300', styles[variant], className);
  if (external) return <a href={href} className={classes} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{content}</a>;
  return <Link href={href} className={classes}>{content}</Link>;
}
