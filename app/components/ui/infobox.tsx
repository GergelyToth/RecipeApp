import { cn } from '#app/utils/misc';
import { Icon, type IconName } from './icon';

interface InfoboxProps {
  info: string;
  iconName: IconName;
  className?: string;
}

const Infobox = ({ info, iconName, className, ...props }: InfoboxProps) => {
  return (
    <div className={cn('inline-flex flex-shrink-0 place-items-center px-2 py-1 rounded font-primary text-xs text-foreground bg-accent', className)} {...props}>
      <Icon name={iconName} className="w-3 h-3 mr-1 text-primary" />
      <span>{info}</span>
    </div>
  );
};
Infobox.displayName = 'Search';

export { Infobox };
