import { z } from "zod";
import { FormSchema, SectionSchema } from "./schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Row } from "./Row";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";

type Props = {
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleTitledSection: (titled: boolean) => void;
  section: z.infer<typeof SectionSchema>;
};

export function Section({
  index: sectionIndex,
  section,
  canMoveUp,
  canMoveDown,
  onDelete,
  onMoveDown,
  onMoveUp,
  onToggleTitledSection,
}: Props) {
  const { control, register } = useFormContext<z.infer<typeof FormSchema>>();
  const rows = useFieldArray({
    name: `sections.${sectionIndex}.rows`,
    control,
  });
  return (
    <div className=" rounded-md shadow-lg border-1 border-slate-200">
      <div className="p-2">
        <h2 className="text-xs uppercase font-bold text-muted-foreground/40">
          Section
        </h2>
        <div className="p-2 space-y-4">
          <div className="flex flex-row justify-between">
            <div>
              {"title" in section ? (
                <div className="flex flex-row space-x-4 items-end">
                  <Label className="flex items-start flex-col space-y-2">
                    <span className="text-sm font-bold">Section Title</span>
                    <Input
                      className="rounded-md border-2 border-slate-700 p-2"
                      {...register(`sections.${sectionIndex}.title`)}
                    />
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleTitledSection(false)}
                  >
                    Change to Untitled Section
                  </Button>
                  <Label className="flex items-start flex-row space-x-2">
                    <Checkbox
                      {...register(`sections.${sectionIndex}.collapsible`)}
                    />
                    <span className="text-sm font-bold">Collapsible?</span>
                  </Label>
                </div>
              ) : (
                <button onClick={() => onToggleTitledSection(true)}>
                  Change to Titled Section
                </button>
              )}
            </div>
            <div className="flex flex-row space-x-2">
              {canMoveUp ? (
                <Button variant="outline" onClick={onMoveUp}>
                  Move Up
                </Button>
              ) : null}
              {canMoveDown ? (
                <Button variant="outline" onClick={onMoveDown}>
                  Move Down
                </Button>
              ) : null}
              <Button variant="destructive" onClick={onDelete}>
                Delete Section
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {rows.fields.map((row, rowIndex) => (
              <div key={row.id}>
                <Row
                  sectionIndex={sectionIndex}
                  rowIndex={rowIndex}
                  canMoveUp={rowIndex > 0}
                  canMoveDown={rowIndex < rows.fields.length - 1}
                  onDelete={() => rows.remove(rowIndex)}
                  onMoveUp={() => rows.swap(rowIndex, rowIndex - 1)}
                  onMoveDown={() => rows.swap(rowIndex, rowIndex + 1)}
                />
              </div>
            ))}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => rows.append({ fields: [] })}
          >
            Add Row
          </Button>
        </div>
      </div>
    </div>
  );
}
