import { useFormContext, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Field } from "./Field";
import { FormSchema, FormWidth } from "./schema";
import { Button } from "~/components/ui/button";

type Props = {
  sectionIndex: number;
  rowIndex: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function Row({
  sectionIndex,
  rowIndex,
  canMoveUp,
  canMoveDown,
  onDelete,
  onMoveDown,
  onMoveUp,
}: Props) {
  const { control, watch } = useFormContext<z.infer<typeof FormSchema>>();
  const fields = useFieldArray({
    name: `sections.${sectionIndex}.rows.${rowIndex}.fields`,
    control,
  });
  const sumWidth = fields.fields.reduce((sum, field, index) => {
    const width = watch(
      `sections.${sectionIndex}.rows.${rowIndex}.fields.${index}.width`
    );
    if (field.type === "document") {
      return 12;
    }
    return sum + Number(width);
  }, 0);
  const isFull = sumWidth >= 12;
  return (
    <div className="rounded-md p-2 border border-slate-200">
      <h2 className="text-xs uppercase font-bold text-muted-foreground/40">
        Row
      </h2>
      <div className="p-2">
        <div className="flex flex-row justify-between">
          <Button
            variant="secondary"
            size="sm"
            disabled={isFull}
            onClick={() =>
              fields.append({
                type: "text",
                width: Math.min(12 - sumWidth, 3) as FormWidth,
                title: "New Field",
              })
            }
          >
            {isFull ? "Cannot add field - row is full" : "Add field"}
          </Button>
          <div className="flex flex-row space-x-4">
            {canMoveUp ? (
              <Button variant="outline" size="sm" onClick={onMoveUp}>
                Move Up
              </Button>
            ) : null}
            {canMoveDown ? (
              <Button variant="outline" size="sm" onClick={onMoveDown}>
                Move Down
              </Button>
            ) : null}
            <Button variant="destructive" size="sm" onClick={onDelete}>
              Delete Row
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 my-2">
          {fields.fields.map((field, index) => (
            <Field
              key={field.id}
              field={field}
              sectionIndex={sectionIndex}
              rowIndex={rowIndex}
              fieldIndex={index}
              canMoveLeft={index > 0}
              canMoveRight={index < fields.fields.length - 1}
              remainingRowWidth={12 - sumWidth}
              onDelete={() => fields.remove(index)}
              onMoveLeft={() => fields.swap(index, index - 1)}
              onMoveRight={() => fields.swap(index, index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
