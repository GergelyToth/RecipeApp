import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, json, type MetaFunction } from '@remix-run/react';
import { z } from 'zod';
import { Field, TextareaField } from '#app/components/forms.tsx';
import { Button } from '#app/components/ui/button.tsx';
import { action } from './new.server.tsx';
import { cn } from '#app/utils/misc.tsx';

export const RecipeNewSchema = z.object({
  name: z.string(),
  instructions: z.string(),
  serves: z.number().default(0),
  cookHours: z.number().default(0),
  cookMinutes: z.number().default(0),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),
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

  // TODO: rewrite the ui with https://ui.shadcn.com/docs/components/form

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
          labelProps={{ children: 'Serves' }}
          inputProps={{ defaultValue: 0, ...getInputProps(fields.serves, { type: 'number' }) }}
          errors={fields.serves.errors}
        />

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
          labelProps={{ children: 'Easy' }}
          inputProps={{ ...getInputProps(fields.difficulty, { type: 'radio', value: 'easy' }), id: 'recipe-editor-difficulty-easy' }}
        />
        <Field
          labelProps={{ children: 'Medium' }}
          inputProps={{ ...getInputProps(fields.difficulty, { type: 'radio', value: 'medium' }), id: 'recipe-editor-difficulty-medium' }}
        />
        <Field
          labelProps={{ children: 'Hard' }}
          inputProps={{ ...getInputProps(fields.difficulty, { type: 'radio', value: 'hard' }), id: 'recipe-editor-difficulty-hard' }}
        />

        <Button type='submit' variant='outlineLight' className='mt-4'>Submit</Button>
      </Form>
    </div>
  );
}
