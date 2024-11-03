import { cn } from '#app/utils/misc';
import { Icon } from './icon';

interface RateProps{
  rating: number;
  className?: string;
}

const Rate = ({ rating, className = '', ...props }: RateProps) => {
  return (
    <div className={cn('bg-mono-800 text-base-white fill-base-white py-1 px-1.5 inline-flex rounded-sm', className)} {...props}>
      <Icon name='outline/star' className='w-3 h-3 mr-1 -mt-0.5' />
      <span className="text-xs font-primary">{rating.toFixed(1)}</span>
    </div>
  );
};
Rate.displayName = 'Rate';

export { Rate };
