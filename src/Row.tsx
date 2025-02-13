import { useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Field } from "./Field";
import { FormSchema } from "./schema";

type Props = {
  sectionIndex: number;
  rowIndex: number;
};

export function Row({ sectionIndex, rowIndex }: Props) {
  const { control } = useFormContext<z.infer<typeof FormSchema>>();
  const fields = useFieldArray({
    name: `sections.${sectionIndex}.rows.${rowIndex}.fields`,
    control,
  });
  return (
    <div>
      {fields.fields.map((field, index) => (
        <div key={field.id}>
          <h4>Field {index}</h4>
          <Field />
        </div>
      ))}
    </div>
  );
}
