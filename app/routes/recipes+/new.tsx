import { json, useLoaderData, type MetaFunction } from '@remix-run/react';
import { prisma } from '#app/utils/db.server.ts';
import { RecipeEditor } from './__recipe-editor.tsx';

export { action } from './__recipe-editor.server.tsx';

export const meta: MetaFunction<typeof loader> = () => [{
  title: 'New Recipe',
}];

export async function loader() {
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
  return json({ ingredients, units });
}
export default function NewRecipe() {
  const { ingredients, units } = useLoaderData<typeof loader>();

  return (
    <RecipeEditor
      ingredients={ingredients}
      units={units}
    />
  );
}
