import { parseWithZod } from '@conform-to/zod';
import { type Prisma } from '@prisma/client';
import {
  type ActionFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { prisma } from '#app/utils/db.server.ts';
import { RecipeNewSchema } from './new.tsx';

function convertTimeToMinutes(hours: number, minutes: number) {
  return (hours * 60) + minutes;
}

export async function action({ request }: ActionFunctionArgs) {
  console.log('asdf');
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: RecipeNewSchema,
  });

  if (submission.status !== 'success') {
    return json(
      { result: submission.reply() },
      { status: submission.status === 'error' ? 400 : 200 }, // TODO: why is this erroring?
    );
  }

  const {
    name,
    instructions,
    servings,
    cookTemp,
    cookHours,
    cookMinutes,
    prepHours,
    prepMinutes,
    difficulty,
    ingredients,
  } = submission.value;

  // process the ingredients. If there is one without an ingredientId, we should create it first, so we can link it to this recipe correctly

  // call Promise.all in case we need to create a new ingredient, which is an async operation, and we want the var to not be a promise
  const processedIngredients = await Promise.all(ingredients.map(async (ingredient) => {
    let {ingredientId} = ingredient;
    if (!ingredientId) {
      const newIngredient = await prisma.ingredient.create({
        data: {
          name: ingredient.name,
          unitId: ingredient.unitId,
        },
      });

      ingredientId = newIngredient.id;
    }

    return ({
      ingredientId,
      quantity: ingredient.quantity,
      unitId: ingredient.unitId,
    });
  }));

  let newRecipe: Prisma.RecipeCreateInput;
  newRecipe = {
    name,
    instructions,
    ingredients: {
      create: [
        ...processedIngredients,
      ],
    },
    cookTemp, // TODO: change schema from number to string, to accomodate for "low/high" cooking temp
    cookTime: convertTimeToMinutes(cookHours, cookMinutes),
    difficulty,
    prepTime: convertTimeToMinutes(prepHours, prepMinutes),
    servings,
  };

  const createdRecipe = await prisma.recipe.create({
    data: { ...newRecipe },
  });

  return redirect(`/recipe/${createdRecipe.id}`);
}
