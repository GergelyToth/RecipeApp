import { parseWithZod } from '@conform-to/zod';
// import { createId as cuid } from '@paralleldrive/cuid2';
import { type Prisma } from '@prisma/client';
import {
  type ActionFunctionArgs,
  json,
  redirect,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node';
import { prisma } from '#app/utils/db.server.ts';
import { 
  RecipeNewSchema,
  MAX_UPLOAD_SIZE,
  type ImageFieldset,
} from './__recipe-editor.tsx';

// TODO: should this move to the helper file?
function convertTimeToMinutes(hours: number, minutes: number) {
  return (hours * 60) + minutes;
}

function imageHasFile(image: ImageFieldset): image is ImageFieldset & { file: NonNullable<ImageFieldset['file']> } {
  return Boolean(image.file?.size && image.file?.size > 0);
}

function imageHasId(image: ImageFieldset): image is ImageFieldset & { id: NonNullable<ImageFieldset['id']> } {
  return image.id != null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await parseMultipartFormData(
    request,
    createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
  );

  const submission = await parseWithZod(formData, {
    schema: RecipeNewSchema.transform(async ({ image = [], ...data }) => {
      return {
        ...data,
        imageUpdates: await Promise.all(
          image.filter(imageHasId).map(async (i) => {
            if (imageHasFile(i)) {
              return {
                id: i.id,
                altText: i.altText,
                contentType: i.file.type,
                blob: Buffer.from(await i.file.arrayBuffer()),
              };
            } else {
              return {
                id: i.id,
                altText: i.altText,
              };
            }
          }),
        ),
        newImages: await Promise.all(
          image
            .filter(imageHasFile)
            .filter((i) => !i.id)
            .map(async (i) => {
              return {
                altText: i.altText,
                contentType: i.file.type,
                blob: Buffer.from(await i.file.arrayBuffer()),
              };
            }),
        ),
      };
    }),
    async: true,
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
    // imageUpdates = [],
    newImages = [],
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
    image: {
      // TODO: we should be able to delete or update the image
      // delete: { id: { notIn: imageUpdates.map((i) => i.id) } },
      // update: imageUpdates.map((updates) => ({
      //   where: { id: updates.id },
      //   data: { ...updates, id: updates.blob ? cuid() : updates.id },
      // })),
      create: newImages,
    },
  };

  const createdRecipe = await prisma.recipe.create({
    data: { ...newRecipe },
  });

  return redirect(`/recipes/${createdRecipe.id}`);
}
