import { cn } from '#app/utils/misc';

interface ChipsProps {
  name: string;
  active: boolean;
  className?: string;
}

const Chips = ({ name, active, className, ...props }: ChipsProps) => {
  const activeClass = active ? 'text-foreground bg-accent' : 'text-foreground border border-accent';
  return (
    <div className={cn('inline-block px-2.5 py-2 rounded font-primary text-xs', activeClass, className)} {...props}>
      {name}
    </div>
  );
};
Chips.displayName = 'Chips';

export { Chips };
