import { Icon } from "#app/components/ui/icon.tsx";
import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { type IconName } from "#app/components/ui/icon.tsx";
import { Rate } from "#app/components/ui/rate.tsx";

import { cn } from "#app/utils/misc.tsx";
import { Infobox } from "#app/components/ui/infobox.tsx";
import { State } from "#app/components/ui/state.tsx";
import { useState } from "react";
import { Button } from "#app/components/ui/button.tsx";

export const meta: MetaFunction = () => [{
  title: 'Recipe - 1',
}];

export default function SingleRecipe() {
  const [currentTab, setCurrentTab] = useState<'method' | 'ingredients'>('method')
  const imgUrl = 'https://picsum.photos/500/500';
  const title = 'Perfect homemade pancake';
  const rating = 4.3;

  // source
  const sourceImgUrl = 'https://picsum.photos/100/100';
  const sourceName = 'Mom';

  type Tag = {
    iconName: IconName;
    name: string;
  }

  const tags: Tag[] = [
    {
      iconName: 'outline/candle-2',
      name: 'Low Calory'
    },
    {
      iconName: 'outline/candle-2',
      name: 'Simple'
    },
    {
      iconName: 'outline/candle-2',
      name: '48 Min'
    },
    {
      iconName: 'outline/star',
      name: '435'
    },
    {
      iconName: 'outline/candle-2',
      name: 'Keto'
    },
  ];

  return (
    <div>
      <header className={cn('h-64 relative flex overflow-hidden rounded-b-xl')}>
        {/* TODO: add navigation to history -1 */}
        <Link to="-1" className={cn('absolute top-5 left-4')}><Icon name="outline/arrow-left" className={cn('w-5 h-5')} /></Link>

        <div className={cn('absolute -top-2 left-0 -z-10 w-full h-1/2 bg-gradient-to-b from-base-black to-transparent')} />
        <div className='absolute -bottom-2 left-0 -z-10 w-full h-1/2 bg-gradient-to-t from-base-black to-transparent' />

        <img src={imgUrl} alt={title} className={cn('-z-20 absolute inset-0 w-full h-full object-cover object-center')} />

        <div className={cn('flex justify-between flex-row self-end w-full px-4 py-3')}>
          <Rate rating={rating} />

          {/* TODO: Links */}
          <div className={cn('flex flex-row justify-evenly gap-2')}>
            <Icon name="outline/archive" className={cn('w-5 h-5')} />
            <Icon name="outline/star" className={cn('w-5 h-5')} />
            <Icon name="outline/gallery-export" className={cn('w-5 h-5')} />
          </div>
        </div>
      </header>

      {/* Source */}
      <div className={cn('flex flex-row gap-1 mt-3')}>
        <div className={cn('flex flex-shrink-0 bg-mono-800 rounded-r-full w-16 justify-end')}>
          <img src={sourceImgUrl} alt={sourceName} className={cn('w-12 h-12 rounded-full')} />
        </div>
        <div className={cn('flex place-items-center px-5 font-bold flex-grow bg-mono-800 rounded-l-full')}>
          {sourceName}
        </div>
      </div>

      {/* Page Title */}
      <h1 className={cn('mt-3 mx-2 px-3 py-2 rounded-lg bg-base-primary  text-base-white text-body-1')}>{title}</h1>

      {/* Tags */}
      <div className={cn('mt-3 mx-2 px-3 py-1.5 bg-mono-400 rounded-lg flex gap-1 flex-wrap')}>
        {tags.map((tag, index) => <Infobox key={`${tag.name}-${index}`} iconName={tag.iconName} info={tag.name} />)}
      </div>

      {/* Tabs */}
      <div className={cn('mt-3 mx-2 flex gap-1')}>
        <div className={cn(currentTab === 'method' ? 'rounded-t-lg bg-mono-300 pb-1' : '')}>
          <Button
            onClick={() => setCurrentTab('method')}
            variant={currentTab === 'method' ? 'activeTab' : 'outlineSquared'}
          >
            <State active={currentTab === 'method'} name="Method" />
          </Button>
        </div>
        <div className={cn(currentTab === 'ingredients' ? 'rounded-t-lg bg-mono-300 pb-1' : '')}>
          <Button
            onClick={() => setCurrentTab('ingredients')}
            variant={currentTab === 'ingredients' ? 'activeTab' : 'outlineSquared'}
          >
            <State active={currentTab === 'ingredients'} name="Ingredients" />
          </Button>
        </div>
      </div>

      <div className={cn('mx-2 rounded-b-lg rounded-tr-lg bg-mono-300 text-base-black py-5 px-5')}>
        {currentTab === 'method' && (
          <>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique veritatis nulla nemo excepturi repellat eveniet unde? Sit eaque, ab a ipsum, quidem quam corporis iusto repellendus hic quis sint deleniti!
          </>
        )}
        {currentTab === 'ingredients' && (
          <>
            <ul>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
