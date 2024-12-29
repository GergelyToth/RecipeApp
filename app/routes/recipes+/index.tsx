import { invariantResponse } from '@epic-web/invariant';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import React from 'react';
import { Card, CardHeader, CardContent } from '#app/components/ui/card';
import { prisma } from '#app/utils/db.server.ts';
import { cn, getRecipeImgSrc } from '#app/utils/misc.tsx';

export async function loader() {
  const recipes = await prisma.recipe.findMany({
    select: {
      id: true,
      name: true,
      ratings: { select: { rating: true } },
      image: {
        select: {
          id: true,
          altText: true,
        },
      },
    },
  });

  invariantResponse(recipes, 'Recipes not found', { status: 404 });

  return json({ recipes });
}

export default function Recipes() {
  const { recipes } = useLoaderData<typeof loader>();

  return (
    <div>
      Recipes

      {recipes.length > 0 && (
        <div className={cn('flex flex-wrap max-w-full gap-8')}>
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipes/${recipe.id}`}
              className={cn('underline shrink-0')}
            >
              <Card>
                <CardHeader>
                  <div className={cn('w-[200px] h-[150px] relative')}>
                    <img 
                      className={cn('absolute inset-0 w-full h-full object-cover')}
                      src={getRecipeImgSrc(recipe.image[0]?.id) || 'https://picsum.photos/200/200'} 
                      alt={recipe.name} 
                    />
                  </div>
                </CardHeader>

                <CardContent>
                  {recipe.name}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
