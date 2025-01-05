import {
  getFieldsetProps,
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
  type FieldMetadata,
} from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { type Recipe, type Unit, type Ingredient } from '@prisma/client';
import { Form } from '@remix-run/react';
import { Check } from 'lucide-react';
import { useRef, useState } from 'react';
import { z } from 'zod';
import { ErrorList, Field, TextareaField } from '#app/components/forms.tsx';
import { Button } from '#app/components/ui/button.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#app/components/ui/command.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import { Input } from '#app/components/ui/input.tsx';
import { Label } from '#app/components/ui/label.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '#app/components/ui/popover.tsx';
import { RadioGroup, RadioGroupItem } from '#app/components/ui/radio-group.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#app/components/ui/select.tsx';
import { Textarea } from '#app/components/ui/textarea.tsx';
import { cn, getRecipeImgSrc, convertMinutesToTime } from '#app/utils/misc.tsx';

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

const ImageFieldsetSchema = z.object({
  id: z.string().optional(),
  file: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, `File size must be less then ${MAX_UPLOAD_SIZE}MB`),
  altText: z.string().optional(),
});

export type ImageFieldset = z.infer<typeof ImageFieldsetSchema>;

export const RecipeNewSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  instructions: z.string(),
  servings: z.number().int().min(0).default(0),
  cookHours: z.number().int().min(0).default(0),
  cookMinutes: z.number().int().min(0).max(59).default(0),
  prepHours: z.number().int().min(0).default(0),
  prepMinutes: z.number().int().min(0).max(59).default(0),
  cookTemp: z.number().int().min(0).default(0),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  ingredients: z.array(
    z.object({
      ingredientId: z.string().optional(),
      name: z.string(),
      quantity: z.number(),
      unitId: z.string(),
      recipeId: z.string().optional(),
    }),
  ),
  image: z.array(ImageFieldsetSchema).max(1).optional(), // TODO: for now have only 1 image per recipe
});

// TODO: check if authenticated when we have users
export function RecipeEditor({
  ingredients,
  units,
  recipe,
}: {
  ingredients: Ingredient[],
  units: Unit[],
  recipe: Recipe,
}) {
  const [open, setOpen] = useState(false);
  const [comboboxValue, setComboboxValue] = useState<Ingredient>(); // TODO: is this even correct?
  const ingredientSearchRef = useRef<HTMLInputElement>(null);
  const [prepHours, prepMinutes] = convertMinutesToTime(recipe.prepTime);
  const [cookHours, cookMinutes] = convertMinutesToTime(recipe.cookTime);

  const [form, fields] = useForm({
    id: 'recipe-editor',
    constraint: getZodConstraint(RecipeNewSchema),
    shouldValidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RecipeNewSchema });
    },
    defaultValue: {
      ...recipe,
      prepHours,
      prepMinutes,
      cookHours,
      cookMinutes,
      ingredients: recipe.ingredients.map((i) => ({
        recipeId: i.recipeId,
        ingredientId: i.ingredient.id,
        name: i.ingredient.name,
        unitId: i.unitId,
        quantity: i.quantity,
      })),
    },
  });
  const ingredientFields = fields.ingredients.getFieldList();
  const imageList = fields.image.getFieldList();

  const addIngredientToRecipe = (selectedIngredient: Ingredient): void => {
    setComboboxValue(undefined);
    form.insert({
      name: fields.ingredients.name,
      defaultValue: {
        ingredientId: selectedIngredient.id,
        name: selectedIngredient.name,
        quantity: 0,
        unitId: selectedIngredient?.defaultUnit?.id,
      },
    });
  };

  const addNewIngredientToRecipe = (ingredientName: string): void => {
    form.insert({
      name: fields.ingredients.name,
      defaultValue: {
        ingredientId: undefined,
        name: ingredientName,
        quantity: 0,
        unitId: undefined,
      },
    });
  };

  return (
    <div className={cn('max-w-screen-sm mx-auto py-10')}>
      <h1 className={cn('font-bold text-h1 mb-8')}>
        {recipe.name ? `Editing: ${recipe.name}` : 'New Recipe'}
      </h1>

      <Form
        method='POST'
        {...getFormProps(form)}
        encType='multipart/form-data'
      >
        {recipe ? <Input {...getFieldsetProps(fields.id)} type='hidden' value={fields.id.initialValue} /> : null}

        <Field
          labelProps={{ children: 'Name' }}
          inputProps={{ ...getInputProps(fields.name, { type: 'text' }), placeholder: 'New recipe name' }}
          errors={fields.name.errors}
        />

        <div>
          <Label>Cover Image</Label>

          <ul>
            {imageList.map((image, index) => {
              return (
                <li
                  key={image.key}
                  className={cn('relative')}
                >
                  <button
                    className="absolute right-0 top-0 text-foreground-destructive"
                    {...form.remove.getButtonProps({
                      name: fields.image.name,
                      index,
                    })}
                  >
                    <span aria-hidden>
                      <Icon name="cross-1" />
                    </span>{' '}
                    <span className="sr-only">
                      Remove image {index + 1}
                    </span>
                  </button>

                  <ImageChooser meta={image} />
                </li>
              );
            })}
          </ul>
        </div>

        {imageList.length < 1 && (
          <Button
            className="mt-2 mb-8"
            {...form.insert.getButtonProps({ name: fields.image.name })}
          >
            <span aria-hidden>
              <Icon name="plus">Image</Icon>
            </span>{' '}
            <span className="sr-only">Add image</span>
          </Button>
        )}

        <Field
          labelProps={{ children: 'Servings' }}
          inputProps={{ defaultValue: 0, ...getInputProps(fields.servings, { type: 'number' }) }}
          errors={fields.servings.errors}
        />

        <Label htmlFor={fields.prepHours.id}>
          Prep Time
        </Label>
        <fieldset about='Prep Time' className={cn('flex w-full gap-4')}>
          <Field
            labelProps={{ children: 'Hours' }}
            inputProps={{ defaultValue: 0, ...getInputProps(fields.prepHours, { type: 'number' }) }}
            errors={fields.prepHours.errors}
            className={cn('w-full')}
          />
          <Field
            labelProps={{ children: 'Minutes' }}
            inputProps={{ defaultValue: 0, ...getInputProps(fields.prepMinutes, { type: 'number' }) }}
            errors={fields.prepMinutes.errors}
            className={cn('w-full')}
          />
        </fieldset>


        <Label htmlFor={fields.cookHours.id}>
          Cook Time
        </Label>
        <fieldset about='Cook Time' className={cn('flex w-full gap-4')}>
          <Field
            labelProps={{ children: 'Hours' }}
            inputProps={{ defaultValue: 0, ...getInputProps(fields.cookHours, { type: 'number' }) }}
            errors={fields.cookHours.errors}
            className={cn('w-full')}
          />
          <Field
            labelProps={{ children: 'Minutes' }}
            inputProps={{ defaultValue: 0, ...getInputProps(fields.cookMinutes, { type: 'number' }) }}
            errors={fields.cookMinutes.errors}
            className={cn('w-full')}
          />
        </fieldset>

        <Field
          labelProps={{ children: 'Cook Tempreature (C°)' }}
          inputProps={{ defaultValue: 0, ...getInputProps(fields.cookTemp, { type: 'number' }) }}
        />

        {/* Difficulty radio button fieldset */}
        <div>
          <Label htmlFor={fields.difficulty.id}>
            Difficulty
          </Label>
          <RadioGroup
            className={cn('grid grid-cols-3 gap-4 relative')}
            defaultValue={recipe.difficulty || 'medium'}
            name={fields.difficulty.name}
            id={fields.difficulty.id}
          >
            <div>
              <RadioGroupItem
                value='easy'
                id='difficulty-easy'
                className='peer sr-only'
                aria-label='Easy'
              />
              <Label
                htmlFor='difficulty-easy'
                className={cn('flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary')}
              >
                Easy
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='medium'
                id='difficulty-medium'
                className='peer sr-only'
                aria-label='Medium'
              />
              <Label
                htmlFor='difficulty-medium'
                className={cn('flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary')}
              >
                Medium
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value='hard'
                id='difficulty-hard'
                className='peer sr-only'
                aria-label='Hard'
              />
              <Label
                htmlFor='difficulty-hard'
                className={cn('flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary')}
              >
                Hard
              </Label>
            </div>
          </RadioGroup>

          <div className="min-h-[32px] px-4 pb-3 pt-1">
            {fields.difficulty.errorId ? <ErrorList id={fields.difficulty.errorId} errors={fields.difficulty.errors} /> : null}
          </div>
        </div>

        <div className={cn('flex gap-4')}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                className={cn('w-full justify-between mb-4')}
              >
                {comboboxValue ? ingredients.find(ingredient => ingredient.name === comboboxValue?.name)?.name : 'Select Ingredient or Create new'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={cn('w-[400px] p-0')}>
              <Command>
                <CommandInput placeholder='Search ingredient...' ref={ingredientSearchRef} />
                <CommandList>
                  <CommandEmpty>
                    <button
                      className={cn('underline')}
                      onClick={() => {
                        addNewIngredientToRecipe(ingredientSearchRef?.current?.value || '');
                        setOpen(false);
                      }}
                    >
                      Add as new ingredient
                    </button>
                  </CommandEmpty>{/* TODO: when pressing enter it should add the new ingredient */}
                  <CommandGroup>
                    {ingredients && ingredients.map((ingredient) => (
                      <CommandItem
                        key={ingredient.id}
                        value={ingredient.name}
                        onSelect={(currentValue) => {
                          if (comboboxValue && comboboxValue.name === currentValue) {
                            setComboboxValue(undefined);
                          } else {
                            const value = ingredients.find(ingredient => ingredient.name === currentValue);
                            setComboboxValue(value);
                          }
                          setOpen(false);
                        }}
                      >
                        <Check className={cn('mr-2 h-4 w-4', comboboxValue && comboboxValue.name === ingredient.name ? 'opacity-100' : 'opacity-0')} />
                        {ingredient.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>

            <Button
              variant='outline'
              role='button'
              className={cn('shrink-0')}
              onClick={(e) => {
                e.preventDefault();
                if (comboboxValue) {
                  addIngredientToRecipe(comboboxValue);
                } else {
                  addNewIngredientToRecipe('');
                }
              }}
            >
              Add Ingredient
            </Button>
          </Popover>
        </div>

        <ol>
          {ingredientFields.length > 0 && (
            <li className={cn('grid grid-cols-12 gap-4 pl-1')}>
              <span className={cn('col-span-1')}>#</span>
              <span className={cn('col-span-5')}>Name</span>
              <span className={cn('col-span-2')}>Quantity</span>
              <span className={cn('col-span-2')}>Unit</span>
              <span className={cn('col-span-2')}>Actions</span>
            </li>
          )}

          {ingredientFields && ingredientFields.map((ingredientField, index) => {
            const fieldset = ingredientField.getFieldset();

            return (
              <li key={ingredientField.key} className={cn('my-2 grid grid-cols-12 gap-4 pl-1')}>
                <span className={cn('self-center')}>{index + 1}.</span>
                <Input {...getFieldsetProps(fieldset.recipeId)} type='hidden' value={fieldset.recipeId.initialValue} />
                <Input {...getFieldsetProps(fieldset.ingredientId)} type='hidden' value={fieldset.ingredientId.initialValue} />

                <Input {...getFieldsetProps(fieldset.name)} defaultValue={fieldset.name.initialValue} className={cn('col-span-5 col-start-2')} placeholder='New ingredient name' />
                <Input {...getFieldsetProps(fieldset.quantity)} defaultValue={fieldset.quantity.initialValue} className={cn('col-span-2')} />

                {/* TODO: if no units are selected, display error border */}
                <Select {...getFieldsetProps(fieldset.unitId)} defaultValue={fieldset.unitId.initialValue}>
                  <SelectTrigger className={cn('inline-flex col-span-2')}>
                    <SelectValue placeholder='Choose a unit' />
                  </SelectTrigger>
                  <SelectContent>
                    {units && units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant='link' type='button' onClick={() => {
                  form.remove({ name: fields.ingredients.name, index });
                }}>
                  <span aria-hidden>
                    <Icon name="cross-1" />
                  </span>{' '}
                  <span className="sr-only">
                    Remove ingredient {index + 1}
                  </span>
                </Button>
              </li>
            );
          })}
        </ol>

        {/* TODO: add markdown parsing */}
        <TextareaField
          labelProps={{ children: 'Instructions' }}
          textareaProps={{ ...getTextareaProps(fields.instructions), className: cn('min-h-[400px]') }}
          errors={fields.instructions.errors}
        />

        <Button type='submit' variant='default' className='mt-4 w-full'>Submit</Button>
      </Form>
    </div>
  );
}

// TODO: move ImageChooser to its separate component
function ImageChooser({ meta }: { meta: FieldMetadata<ImageFieldset> }) {
  const fields = meta.getFieldset();
  const existingImage = Boolean(fields.id.initialValue);
  const [previewImage, setPreviewImage] = useState<string | null>(
    fields.id.initialValue ? getRecipeImgSrc(fields.id.initialValue) : null,
  );
  const [altText, setAltText] = useState(fields.altText.initialValue ?? '');

  return (
    <fieldset {...getFieldsetProps(meta)}>
      <div className="flex gap-3">
        <div className="w-32">
          <div className="relative h-32 w-32">
            <label
              htmlFor={fields.file.id}
              className={cn('group absolute h-32 w-32 rounded-lg', {
                'bg-accent opacity-40 focus-within:opacity-100 hover:opacity-100':
                  !previewImage,
                'cursor-pointer focus-within:ring-2': !existingImage,
              })}
            >
              {previewImage ? (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt={altText ?? ''}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                  {existingImage ? null : (
                    <div className="pointer-events-none absolute -right-0.5 -top-0.5 rotate-12 rounded-sm bg-secondary px-2 py-1 text-xs text-secondary-foreground shadow-md">
                      new
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-muted-foreground text-4xl text-muted-foreground">
                  <Icon name="plus" />
                </div>
              )}
              {existingImage ? (
                <input {...getInputProps(fields.id, { type: 'hidden' })} />
              ) : null}
              <input
                aria-label="Image"
                className="absolute left-0 top-0 z-0 h-32 w-32 cursor-pointer opacity-0"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewImage(null);
                  }
                }}
                accept="image/*"
                {...getInputProps(fields.file, { type: 'file' })}
              />
            </label>
          </div>
          <div className="min-h-[32px] px-4 pb-3 pt-1">
            <ErrorList id={fields.file.errorId} errors={fields.file.errors} />
          </div>
        </div>
        <div className="flex-1">
          <Label htmlFor={fields.altText.id}>Alt Text</Label>
          <Textarea
            onChange={(e) => setAltText(e.currentTarget.value)}
            {...getTextareaProps(fields.altText)}
          />
          <div className="min-h-[32px] px-4 pb-3 pt-1">
            <ErrorList
              id={fields.altText.errorId}
              errors={fields.altText.errors}
            />
          </div>
        </div>
      </div>
      {meta.errors && meta.errors.length > 0 && (
        <div className="min-h-[32px] px-4 pb-3 pt-1">
          <ErrorList id={meta.errorId} errors={meta.errors} />
        </div>
      )}
    </fieldset>
  );
}
