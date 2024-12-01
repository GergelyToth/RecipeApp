import { invariantResponse } from '@epic-web/invariant';
import { json } from '@remix-run/node';
import React from 'react';
import { prisma } from '#app/utils/db.server.ts';
import { Link, useLoaderData } from '@remix-run/react';

export async function loader() {
  const recipes = await prisma.recipe.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      ratings: { select: { rating: true } },
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
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
        </div>
      ))}
    </div>
  );
}
