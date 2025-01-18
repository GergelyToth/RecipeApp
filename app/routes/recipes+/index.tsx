import { invariantResponse } from '@epic-web/invariant';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import React, { useState } from 'react';
import { Filter } from '#app/components/filter.tsx';
import { Button } from '#app/components/ui/button';
import { Card, CardHeader, CardContent } from '#app/components/ui/card';
import { Search } from '#app/components/ui/search';
import { prisma } from '#app/utils/db.server';
import { cn, getRecipeImgSrc } from '#app/utils/misc';

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
      ingredients: {
        select: {
          ingredient: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  invariantResponse(recipes, 'Recipes not found', { status: 404 });

  return json({ recipes });
}

export default function Recipes() {
  const [searchValue, setSearchValue] = useState<string>('');
  const { recipes } = useLoaderData<typeof loader>();
  const [ingredientFilterValues, setIngredientFilterValues] = useState<string[] | undefined>([]);

  // NOTE: this is client side search only, with the assumption we don't need to re-query the db, as we returned everything on page load
  let resultRecipes: typeof recipes = [...recipes];
  if (searchValue !== '') {
    resultRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(searchValue.toLowerCase()));
  }

  if (ingredientFilterValues?.length) {
    resultRecipes = resultRecipes.filter(recipe =>
      recipe.ingredients.filter(i => ingredientFilterValues?.includes(i.ingredient.name)).length > 0,
    );
  }

  const allIngredients: string[] = [];
  recipes.forEach(recipe => {
    recipe?.ingredients.forEach(i => {
      const { ingredient } = i;
      if (!allIngredients.includes(ingredient.name)) {
        allIngredients.push(ingredient.name);
      }
    });
  });

  return (
    <div>
      <h1 className={cn('text-h1')}>Recipes</h1>


      <div className={cn('flex column gap-4 place-items-center my-4')}>
        <Filter
          title='Filter by Ingredients'
          setFilterValues={setIngredientFilterValues}
          options={allIngredients.toSorted().map((x: string) => ({ label: x, value: x }))}
        />

        <Search
          onChange={(e) => setSearchValue(e.target.value)} value={searchValue}
        />
      </div>


      <Button className={cn('my-4')}>
        <Link to="/recipes/new">Create Recipe</Link>
      </Button>

      {resultRecipes.length > 0 && (
        <div className={cn('flex flex-wrap max-w-full gap-8')}>
          {resultRecipes.map((recipe) => {
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
