import { CSSProperties } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FieldDefinitionSchema, FormSchema } from "~/schema";

type Props = {
  sectionIndex: number;
  rowIndex: number;
  fieldIndex: number;
  field: z.infer<typeof FieldDefinitionSchema>;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  remainingRowWidth: number;
  onDelete: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
};

const TEXT_FIELD_TYPES: Array<z.infer<typeof FieldDefinitionSchema>["type"]> = [
  "title",
  "subtitle",
  "paragraph",
];

const FILE_FIELD_TYPES: Array<z.infer<typeof FieldDefinitionSchema>["type"]> = [
  "document",
];

const INPUT_FIELD_TYPES: Array<z.infer<typeof FieldDefinitionSchema>["type"]> =
  [
    "text",
    "number",
    "checkbox",
    "yes_no",
    "composite_checkbox",
    "date",
    "date_time",
    "radio",
    "select",
  ];

export function Field({
  sectionIndex,
  rowIndex,
  fieldIndex,
  remainingRowWidth,
  canMoveLeft,
  canMoveRight,
  onMoveLeft,
  onMoveRight,
  onDelete,
}: Props) {
  const methods = useFormContext<z.infer<typeof FormSchema>>();
  const [type, width] = methods.watch([
    `sections.${sectionIndex}.rows.${rowIndex}.fields.${fieldIndex}.type`,
    `sections.${sectionIndex}.rows.${rowIndex}.fields.${fieldIndex}.width`,
  ]);
  return (
    <div
      style={
        {
          "--field-width": `${type === "document" ? 12 : width}`,
        } as CSSProperties
      }
      className="col-span-(--field-width) p-2"
    >
      <div className="p-2 rounded-md bg-slate-100">
        <h2 className="text-xs uppercase font-bold text-muted-foreground/40">
          Field
        </h2>
        <div className="space-y-2">
          <div className="flex flex-row space-x-2">
            {canMoveLeft ? (
              <Button size="sm" variant="outline" onClick={onMoveLeft}>
                Move Left
              </Button>
            ) : null}
            {canMoveRight ? (
              <Button size="sm" variant="outline" onClick={onMoveRight}>
                Move Right
              </Button>
            ) : null}
            <Button size="sm" variant="destructive-outline" onClick={onDelete}>
              Delete Field
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Label>
              <span className="text-sm font-bold">Field Name</span>
              {INPUT_FIELD_TYPES.includes(type) ? (
                <Input
                  {...methods.register(
                    `sections.${sectionIndex}.rows.${rowIndex}.fields.${fieldIndex}.title`
                  )}
                />
              ) : (
                "N/A"
              )}
            </Label>
            <Label>
              <span className="text-sm font-bold">Width</span>
              {type !== "document" ? (
                <Input
                  type="number"
                  {...methods.register(
                    `sections.${sectionIndex}.rows.${rowIndex}.fields.${fieldIndex}.width`
                  )}
                  min={1}
                  max={remainingRowWidth}
                />
              ) : (
                "N/A"
              )}
            </Label>
          </div>
          <Label className="capitalize w-full">
            <span className="text-sm font-bold">Type</span>
            <Select
              {...methods.register(
                `sections.${sectionIndex}.rows.${rowIndex}.fields.${fieldIndex}.type`
              )}
            >
              <SelectTrigger>
                <SelectValue className="capitalize" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Input Fields</SelectLabel>
                  {INPUT_FIELD_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      className="capitalize pl-2"
                      value={type}
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>File Inputs</SelectLabel>
                  {FILE_FIELD_TYPES.map((type) => (
                    <SelectItem key={type} className="capitalize" value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Text Display</SelectLabel>
                  {TEXT_FIELD_TYPES.map((type) => (
                    <SelectItem key={type} className="capitalize" value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>
        </div>
      </div>
    </div>
  );
}
