import { invariantResponse } from '@epic-web/invariant';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { marked } from 'marked';
import { type FC } from 'react';
import { Badge } from '#app/components/ui/badge.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import { Rate } from '#app/components/ui/rate.tsx';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '#app/components/ui/tabs.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { cn, getRecipeImgSrc } from '#app/utils/misc.tsx';

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
      image: {
        select: {
          id: true,
          altText: true,
        },
      },
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

  const hasImage = recipe.image.length > 0 && recipe.image[0] && recipe.image[0].id;
  const imgUrl = hasImage ? getRecipeImgSrc((recipe.image as any)[0].id) : ''; // TODO: if no image display default
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

  // NOTE: instructions have been serialized with the `insane` package.
  const instructionsMarkdown = { __html: marked.parse(recipe.instructions || '') };

  return (
    <div>
      <header className={cn('h-64 relative flex overflow-hidden rounded-b-xl')}>
        {/* TODO: add navigation to history -1 */}
        <Link to='/recipes/' className={cn('absolute top-5 left-4')}>
          <Icon name="outline/arrow-left" className={cn('w-5 h-5')} />
        </Link>

        <div className={cn('absolute -top-2 left-0 -z-10 w-full h-1/2 bg-gradient-to-b from-black to-transparent')} />
        <div className='absolute -bottom-2 left-0 -z-10 w-full h-1/2 bg-gradient-to-t from-black to-transparent' />

        {imgUrl && imgUrl.length > 0 ? (
          <img src={imgUrl} alt={recipe.name} className={cn('-z-20 absolute inset-0 w-full h-full object-cover object-center')} />
        ) : (
          <span className={cn('absolute top-2.5 left-1/2 -translate-x-1/2 text-[200px] leading-none block text-center grayscale')}>🍽️</span>
        )}

        <div className={cn('flex justify-between flex-row self-end w-full px-4 py-3')}>
          <Rate rating={rating} />

          {/* TODO: Links */}
          <div className={cn('flex flex-row justify-evenly gap-2')}>
            {/*
            <Icon name="outline/archive" className={cn('w-5 h-5')} />
            <Icon name="outline/star" className={cn('w-5 h-5')} />
            <Icon name="outline/gallery-export" className={cn('w-5 h-5')} />
            */}
            <Link to={`/recipes/${recipe.id}/edit`}>Edit</Link>
          </div>
        </div>
      </header>

      <div className={cn('max-w-screen-md px-6 mx-auto')}>
        {/* Source */}
        <div className={cn('flex gap-4 items-center mt-6')}>
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
            <div className={cn('remove-all')} dangerouslySetInnerHTML={instructionsMarkdown} />
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
