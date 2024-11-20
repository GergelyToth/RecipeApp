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
  } = submission.value;


  let newRecipe: Prisma.RecipeCreateInput;
  newRecipe = {
    name,
    instructions,
    // ingredients
    cookTemp,
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
