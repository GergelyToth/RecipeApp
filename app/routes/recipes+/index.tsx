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
      <h1>Recipes</h1>

      {recipes.length > 0 && (
        <div className={cn('flex flex-wrap max-w-full gap-8')}>
          {recipes.map((recipe) => {
            const hasImage = recipe.image.length > 0 && recipe.image[0] && recipe.image[0].id;

            return (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className={cn('shrink-0 grow-0 text-wrap w-[250px]')}
              >
                <Card>
                  <CardHeader>
                    <div className={cn('w-[200px] h-[150px] relative')}>
                      {hasImage && (
                        <img
                          className={cn('absolute inset-0 w-full h-full object-cover')}
                          src={getRecipeImgSrc(recipe.image[0]!.id)}
                          alt={recipe.name}
                        />
                      )}

                      {!hasImage && (
                        <span className={cn('text-[120px] leading-none block text-center')}>🍽️</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    {recipe.name}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
