import { invariantResponse } from '@epic-web/invariant';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { type FC } from 'react';
import { Avatar, AvatarFallback } from '#app/components/ui/avatar.tsx';
import { Badge } from '#app/components/ui/badge.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import { Rate } from '#app/components/ui/rate.tsx';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '#app/components/ui/tabs.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#app/components/ui/tooltip.tsx';
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
      cookTime: true,
      prepTime: true,
      cookTemp: true,
      difficulty: true,
      servings: true,
    },
    where: {
      id: params.recipe,
    },
  });

  invariantResponse(recipe, 'Recipe not found', { status: 404 });

  return json({ recipe });
}

function displayMinuteBasedTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours ? hours + 'h' : ''} ${mins ? mins + 'm' : ''}`.trim();
}

export default function SingleRecipe() {
  const data = useLoaderData<typeof loader>();
  const { recipe } = data;

  const imgUrl = 'https://picsum.photos/500/500'; // TODO: get img from db
  const rating = recipe.ratings.reduce((sum, current) => sum += current.rating, 0) / recipe.ratings.length;

  const badges = [];
  badges.push(recipe.difficulty);
  if (recipe.prepTime) {
    badges.push(`Prep time: ${displayMinuteBasedTime(recipe.prepTime)}`);
  }
  if (recipe.cookTime) {
    badges.push(`Cook time: ${displayMinuteBasedTime(recipe.cookTime)}`);
  }
  if (recipe.cookTemp) {
    badges.push(`Cook temp: ${recipe.cookTemp}C°`);
  }

  return (
    <div>
      <header className={cn('h-64 relative flex overflow-hidden rounded-b-xl')}>
        {/* TODO: add navigation to history -1 */}
        <Link to='/recipes/' className={cn('absolute top-5 left-4')}><Icon name="outline/arrow-left" className={cn('w-5 h-5')} /></Link>

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

      <div className={cn('max-w-screen-md px-6 mx-auto')}>
        {/* Source */}
        <div className={cn('flex gap-4 items-center mt-6')}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar>
                  {/* TODO: add source image? */}
                  <AvatarFallback>{recipe.source?.name?.substring(0, 1)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                {recipe.source?.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <h1 className={cn('text-h5')}>{recipe.name}</h1>
        </div>

        <div className={cn('mt-4 flex gap-2 flex-wrap')}>
          {badges.map((badge, index) => (
            <Badge key={`badge-${index}`} variant='secondary'>{badge}</Badge>
          ))}
        </div>

        {/* Tabs */}
        <Tabs className={cn('mt-6')} defaultValue='instructions'>
          <TabsList className={cn('min-w-64 ')}>
            <TabsTrigger value='instructions' className={cn('grow')}>Instructions</TabsTrigger>
            <TabsTrigger value='ingredients' className={cn('grow')}>Ingredients</TabsTrigger>
          </TabsList>
          <TabsContent value='instructions' className={cn('px-2 pt-2')}>
            {/* TODO: format! */}
            <p className={cn('whitespace-break-spaces text-sm md:text-md')}>{recipe.instructions}</p>
          </TabsContent>

          <TabsContent value='ingredients' className={cn('px-2 pt-2')}>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const Ingredient: FC<{ quantity: number, unit: string, name: string }> = ({ quantity, unit, name }) => (
  <li className={cn('text-sm md:text-md mb-1')}>
    {quantity}{unit} - <span className={cn('text-blue-500')}>{name}</span>
  </li>
);
