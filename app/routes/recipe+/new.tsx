import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, json, type MetaFunction } from '@remix-run/react';
import { z } from 'zod';
import { ErrorList, Field, TextareaField } from '#app/components/forms.tsx';
import { Button } from '#app/components/ui/button.tsx';
import { Label } from '#app/components/ui/label.tsx';
import { RadioGroup, RadioGroupItem } from '#app/components/ui/radio-group.tsx';
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
});

export { action };

export async function loader() {
  return json({});
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [{
  title: `New Recipe`,
}];

// TODO: check if authenticated when we have users
export default function NewRecipe() {
  const [form, fields] = useForm({
    id: 'recipe-editor',
    constraint: getZodConstraint(RecipeNewSchema),
    shouldValidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RecipeNewSchema });
    },
  });

  return (
    <div>
      New recipe

      <Form
        method='POST'
        {...getFormProps(form)}
      >
        <Field
          labelProps={{ children: 'Name' }}
          inputProps={{ ...getInputProps(fields.name, { type: 'text' }) }}
          errors={fields.name.errors}
        />

        <TextareaField
          labelProps={{ children: 'Instructions' }}
          textareaProps={{ ...getTextareaProps(fields.instructions) }}
          errors={fields.instructions.errors}
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
          labelProps={{ children: `Cook Tempreature (C°)` }}
          inputProps={{ defaultValue: 0, ...getInputProps(fields.cookTemp, { type: 'number' }) }}
        />

        {/* Difficulty radio button fieldset */}
        <div>
          <Label htmlFor={fields.difficulty.id}>
            Difficulty
          </Label>
          <RadioGroup
            className={cn('grid grid-cols-3 gap-4')}
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

        <Button type='submit' variant='outlineLight' className='mt-4 w-full'>Submit</Button>
      </Form>
    </div>
  );
}
