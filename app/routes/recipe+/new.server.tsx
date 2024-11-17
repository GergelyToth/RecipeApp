import { parseWithZod } from "@conform-to/zod";
import { type Prisma } from "@prisma/client";
import {
  type ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { prisma } from "#app/utils/db.server.ts";
import { RecipeNewSchema } from './new.tsx';

export async function action({ request }: ActionFunctionArgs) {
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
  } = submission.value;

  let newRecipe: Prisma.RecipeCreateInput;
  newRecipe = {
    name,
    instructions,
    // ingredients
    cookTemp: 0,
    cookTime: 0,
    difficulty: 'easy',
    prepTime: 0,
    servings: 0,
  };

  const createdRecipe = await prisma.recipe.create({
    data: { ...newRecipe },
  });

  console.log('created a new recipe', JSON.stringify(createdRecipe));

  return redirect(`/recipe/${createdRecipe.id}`);
}
