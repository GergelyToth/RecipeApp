import { cn } from '#app/utils/misc';

interface ChipsProps {
  name: string;
  active: boolean;
  className?: string;
}

const Chips = ({ name, active, className, ...props }: ChipsProps) => {
  const activeClass = active ? 'text-base-black bg-base-tertiary' : 'text-base-white border border-mono-800';
  return (
    <div className={cn('inline-block px-2.5 py-2 rounded-full font-primary text-xs', activeClass, className)} {...props}>
      {name}
    </div>
  );
};
Chips.displayName = 'Rate';

export { Chips };
