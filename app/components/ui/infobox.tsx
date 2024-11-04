import { cn } from '#app/utils/misc';
import { Icon, type IconName } from './icon';

interface InfoboxProps {
  info: string;
  iconName: IconName;
  className?: string;
}

const Infobox = ({ info, iconName, className, ...props }: InfoboxProps) => {
  return (
    <div className={cn('inline-flex place-items-center px-2 py-1 rounded font-primary text-xs bg-base-white', className)} {...props}>
      <Icon name={iconName} className="w-3 h-3 mr-1 text-base-primary" />
      <span>{info}</span>
    </div>
  );
}
Infobox.displayName = 'Search';

export { Infobox };
