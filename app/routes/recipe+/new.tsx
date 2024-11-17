import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, json, type MetaFunction } from '@remix-run/react';
import { z } from 'zod';
import { Field, TextareaField } from '#app/components/forms.tsx';
import { Button } from '#app/components/ui/button.tsx';
import { action } from './new.server.tsx';

export const RecipeNewSchema = z.object({
  name: z.string(),
  instructions: z.string(),
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
          labelProps={{ children: 'Recipe Name' }}
          inputProps={{ ...getInputProps(fields.name, { type: 'text' }) }}
          errors={fields.name.errors}
        />
        <TextareaField
          labelProps={{ children: 'Instructions' }}
          textareaProps={{ ...getTextareaProps(fields.instructions) }}
          errors={fields.instructions.errors}
        />
        <Button type='submit' variant='outlineLight' className='mt-4'>Submit</Button>
      </Form>
    </div>
  );
}
