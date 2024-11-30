import { invariantResponse } from '@epic-web/invariant';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { type FC, useState } from 'react';
import { Button } from '#app/components/ui/button.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
// import { Infobox } from "#app/components/ui/infobox.tsx";
import { Rate } from '#app/components/ui/rate.tsx';

import { prisma } from '#app/utils/db.server.ts';
import { cn } from '#app/utils/misc.tsx';

export const meta: MetaFunction<typeof loader> = ({ data }) => [{
  title: `Recipe - ${data?.recipe.name}`,
}];

export async function loader({ params }: LoaderFunctionArgs) {
  const recipe = await prisma.recipe.findFirst({
    select: {
      id: true,
      name: true,
      ratings: { select: { rating: true } },
      source: { select: { name: true, icon: true } },
      ingredients: {
        select: {
          ingredientId: true,
          quantity: true,
          unit: { select: { name: true } },
          ingredient: { select: { name: true } },
        },
      },
      instructions: true,
    },
    where: {
      id: params.recipe,
    },
  });

  invariantResponse(recipe, 'Recipe not found', { status: 404 });

  return json({ recipe });
}

export default function SingleRecipe() {
  const data = useLoaderData<typeof loader>();
  const { recipe } = data;

  const [currentTab, setCurrentTab] = useState<'instructions' | 'ingredients'>('instructions');

  const imgUrl = 'https://picsum.photos/500/500'; // TODO: get img from db
  const rating = recipe.ratings.reduce((sum, current) => sum += current.rating, 0) / recipe.ratings.length;
  // source

  return (
    <div>
      <header className={cn('h-64 relative flex overflow-hidden rounded-b-xl')}>
        {/* TODO: add navigation to history -1 */}
        <Link to="-1" className={cn('absolute top-5 left-4')}><Icon name="outline/arrow-left" className={cn('w-5 h-5')} /></Link>

        <div className={cn('absolute -top-2 left-0 -z-10 w-full h-1/2 bg-gradient-to-b from-black to-transparent')} />
        <div className='absolute -bottom-2 left-0 -z-10 w-full h-1/2 bg-gradient-to-t from-black to-transparent' />

        <img src={imgUrl} alt={recipe.name} className={cn('-z-20 absolute inset-0 w-full h-full object-cover object-center')} />

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
          {/* TODO: change to question mark */}
          <Icon name={recipe.source?.icon || 'outline/sun'} className={cn('w-12 h-12 rounded-full')} />
        </div>
        <div className={cn('flex place-items-center px-5 font-bold flex-grow bg-mono-800 rounded-l-full')}>
          {recipe.source?.name || ''}
        </div>
      </div>

      {/* Page Title */}
      <h1 className={cn('mt-3 mx-2 px-3 py-2 rounded-lg bg-primary  text-white text-body-1')}>{recipe.name}</h1>

      {/* Tags */}
      {/* <div className={cn('mt-3 mx-2 px-3 py-1.5 bg-mono-400 rounded-lg flex gap-1 flex-wrap')}>
        {tags.map((tag, index) => <Infobox key={`${tag.name}-${index}`} iconName={tag.iconName} info={tag.name} />)}
      </div> */}

      {/* Tabs */}
      <div className={cn('mt-3 mx-2 flex gap-1')}>
        <div className={cn(currentTab === 'instructions' ? 'rounded-t-lg bg-mono-300 pb-1' : '')}>
          <Button
            onClick={() => setCurrentTab('instructions')}
            variant={currentTab === 'instructions' ? 'link' : 'outline'}
          >
            Instructions
          </Button>
        </div>
        <div className={cn(currentTab === 'ingredients' ? 'rounded-t-lg bg-mono-300 pb-1' : '')}>
          <Button
            onClick={() => setCurrentTab('ingredients')}
            variant={currentTab === 'ingredients' ? 'link' : 'outline'}
          >
            Ingredients
          </Button>
        </div>
      </div>

      <div className={cn('mx-2 rounded-b-lg rounded-tr-lg bg-mono-300 text-black py-5 px-5')}>
        {currentTab === 'instructions' && (
          <>
            {recipe.instructions}
          </>
        )}
        {currentTab === 'ingredients' && (
          <>
            <ul>
              {recipe.ingredients.map((ingredient => (
                <Ingredient
                  key={ingredient.ingredientId}
                  name={ingredient.ingredient.name}
                  unit={ingredient.unit?.name || ''}
                  quantity={ingredient.quantity}
                />
              )))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

const Ingredient: FC<{ quantity: number, unit: string, name: string }> = ({ quantity, unit, name }) => (
  <li>
    {quantity}{unit} - {name}
  </li>
);
