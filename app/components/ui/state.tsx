import * as React from 'react';

import { cn } from '#app/utils/misc.tsx';

export interface StateProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  active: boolean;
}

const State = React.forwardRef<HTMLDivElement, StateProps>(({name, active, className, ...props }, ref) => {
  const activeClass = active ? 'text-mono-800 text-body-6 border-solid border-b border-b-base-primary' : 'text-mono-700 text-body-5';
  return (
    <div
      className={cn('font-primary inline-block py-1 px-2', activeClass, className)}
      ref={ref}
      {...props}
    >
      {name}
    </div>
  )
});
State.displayName = 'State';

export { State };
