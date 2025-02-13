import { z } from "zod";
import { FormSchema } from "./schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Row } from "./Row";

type Props = {
  index: number;
};

export function Section({ index: sectionIndex }: Props) {
  const { control } = useFormContext<z.infer<typeof FormSchema>>();
  const rows = useFieldArray({
    name: `sections.${sectionIndex}.rows`,
    control,
  });
  return (
    <div>
      {rows.fields.map((row, rowIndex) => (
        <div key={row.id}>
          <div className="flex flex-row space-x-4">
            <button onClick={() => rows.remove(rowIndex)}>Delete Row</button>
            {rowIndex !== 0 ? (
              <button onClick={() => rows.swap(rowIndex, rowIndex - 1)}>
                Move Up
              </button>
            ) : null}
            {rowIndex !== rows.fields.length - 1 ? (
              <button onClick={() => rows.swap(rowIndex, rowIndex + 1)}>
                Move Down
              </button>
            ) : null}
          </div>
          <Row sectionIndex={sectionIndex} rowIndex={rowIndex} />
        </div>
      ))}
      <button onClick={() => rows.append({ fields: [] })}>Add Row</button>
    </div>
  );
}
