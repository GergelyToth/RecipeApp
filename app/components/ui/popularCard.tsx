import * as React from 'react';

import { Icon, type IconName } from '#app/components/ui/icon';
import { Rate } from '#app/components/ui/rate';

import { cn } from '#app/utils/misc.tsx';

interface PopularCardProps extends React.HTMLAttributes<HTMLDivElement>{
  name: string;
  link: string;
  imageUrl: string;
  rating: number;
  iconName?: IconName;
}

const PopularCard = React.forwardRef<HTMLDivElement, PopularCardProps>(({ name, link, imageUrl, rating, iconName, className, ...props }, ref) => {
  return (
    <div className={cn('relative rounded flex flex-col justify-between w-40 h-52 p-2 overflow-hidden', className)} ref={ref} {...props}>
      <div className='absolute -top-2 left-0 -z-10 w-full h-1/2 bg-gradient-to-b from-black to-transparent' />
      <div className='absolute -bottom-2 left-0 -z-10 w-full h-1/2 bg-gradient-to-t from-black to-transparent' />

      <div className='flex flex-row justify-between'>
        <Rate rating={rating} />

        {/* TODO: icon click & hover */}
        {iconName && <Icon name={iconName} className='w-6 h-6 text-white' />}
      </div>

      <img
        className="-z-20 absolute inset-0 w-full h-full object-cover"
        src={imageUrl}
        alt={name}
      />
      <a className='font-primary font-bold text-white' href={link}>{name}</a>
    </div>
  );
});
PopularCard.displayName = 'PopularCard';

export { PopularCard };
