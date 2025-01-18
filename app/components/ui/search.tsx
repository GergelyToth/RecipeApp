import * as React from 'react';
import { Input } from '#app/components/ui/input';

import { cn } from '#app/utils/misc';
import { Icon } from './icon';

export interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Search = React.forwardRef<HTMLInputElement, SearchProps>(({ className, ...props }, ref) => {
  return (
    <div className='relative grow'>
      <label>
        <Icon name='outline/search-normal' className='w-6 h-6 absolute top-1/2 left-2.5 -translate-y-1/2 cursor-pointer' />
        <Input
          className={cn('pl-10', className)}
          placeholder='Search'
          name='Search'
          ref={ref}
          {...props}
        />
      </label>
    </div>
  );
});
Search.displayName = 'Search';

export { Search };
