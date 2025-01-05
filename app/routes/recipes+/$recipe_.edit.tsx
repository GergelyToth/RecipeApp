import { json, useLoaderData, type ClientLoaderFunctionArgs } from '@remix-run/react';
import { prisma } from '#app/utils/db.server.ts';
import { RecipeEditor } from './__recipe-editor';

export { action } from './__recipe-editor.server.tsx';

export async function loader({ params }: ClientLoaderFunctionArgs) {
  const recipeId = params.recipe;

  const ingredients = await prisma.ingredient.findMany({
    select: {
      id: true,
      name: true,
      defaultUnit: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  const units = await prisma.unit.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const recipe = await prisma.recipe.findUnique({
    select: {
      id: true,
      name: true,
      servings: true,
      prepTime: true,
      cookTime: true,
      cookTemp: true,
      ingredients: {
        select: {
          quantity: true,
          unitId: true,
          ingredient: true,
          recipeId: true,
        },
      },
      difficulty: true,
      instructions: true,
      image: true,
    },
    where: {
      id: recipeId,
    },
  });
  return json({ ingredients, units, recipe });
}

export default function EditRecipe() {
  const { ingredients, units, recipe } = useLoaderData<typeof loader>();

  return (
    <RecipeEditor units={units} ingredients={ingredients} recipe={recipe} />
  );
}
