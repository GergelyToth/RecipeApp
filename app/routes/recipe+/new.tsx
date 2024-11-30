import { getFieldsetProps, getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, json, useLoaderData, type MetaFunction } from '@remix-run/react';
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
import { prisma } from '#app/utils/db.server.ts';
import { cn } from '#app/utils/misc.tsx';
import { action } from './new.server.tsx';

export const RecipeNewSchema = z.object({
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
    }),
  ),
});

export { action };

export async function loader() {
  const ingredients = await prisma.ingredient.findMany({
    select: {
      id: true,
      name: true,
      defaultUnit: true,
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

export const meta: MetaFunction<typeof loader> = () => [{
  title: 'New Recipe',
}];

// TODO: check if authenticated when we have users
export default function NewRecipe() {
  const { ingredients, units } = useLoaderData<typeof loader>();
  type Ingredient = typeof ingredients[0];

  const [open, setOpen] = useState(false);
  const [comboboxValue, setComboboxValue] = useState<Ingredient>(); // TODO: is this even correct?
  const ingredientSearchRef = useRef<HTMLInputElement>(null);

  const [form, fields] = useForm({
    id: 'recipe-editor',
    constraint: getZodConstraint(RecipeNewSchema),
    shouldValidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RecipeNewSchema });
    },
  });
  const ingredientFields = fields.ingredients.getFieldList();

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
      <h1 className={cn('font-bold text-h1 mb-8')}>New recipe</h1>

      <Form
        method='POST'
        {...getFormProps(form)}
      >
        <Field
          labelProps={{ children: 'Name' }}
          inputProps={{ ...getInputProps(fields.name, { type: 'text' }), placeholder: 'New recipe name' }}
          errors={fields.name.errors}
        />

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
            defaultValue='medium'
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
                    {ingredients.map((ingredient) => (
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

        <ol className={cn('')}>
          {ingredientFields.length > 0 && (
            <li className={cn('grid grid-cols-12 gap-4 pl-1')}>
              <span className={cn('col-span-1')}>#</span>
              <span className={cn('col-span-5')}>Name</span>
              <span className={cn('col-span-2')}>Quantity</span>
              <span className={cn('col-span-2')}>Unit</span>
              <span className={cn('col-span-2')}>Actions</span>
            </li>
          )}

          {ingredientFields.map((ingredientField, index) => {
            const fieldset = ingredientField.getFieldset();

            return (
              <li key={ingredientField.key} className={cn('my-2 grid grid-cols-12 gap-4 pl-1')}>
                <span className={cn('self-center')}>{index + 1}.</span>
                <Input {...getFieldsetProps(fieldset.ingredientId)} type='hidden' value={fieldset.ingredientId.initialValue} />

                <Input {...getFieldsetProps(fieldset.name)} defaultValue={fieldset.name.initialValue} className={cn('col-span-5 col-start-2')} placeholder='New ingredient name' />
                <Input {...getFieldsetProps(fieldset.quantity)} defaultValue={fieldset.quantity.initialValue} className={cn('col-span-2')} />

                {/* TODO: if no units are selected, display error border */}
                <Select {...getFieldsetProps(fieldset.unitId)} defaultValue={fieldset.unitId.initialValue}>
                  <SelectTrigger className={cn('inline-flex col-span-2')}>
                    <SelectValue placeholder='Choose a unit' />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
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

        <TextareaField
          labelProps={{ children: 'Instructions' }}
          textareaProps={{ ...getTextareaProps(fields.instructions), className: cn('min-h-[400px]') }}
          errors={fields.instructions.errors}
        />

        <Button type='submit' variant='outline' className='mt-4 w-full'>Submit</Button>
      </Form>
    </div>
  );
}
