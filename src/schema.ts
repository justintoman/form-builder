import { z } from "zod";

const FormWidthSchema = z.coerce.number().int().min(1).max(12);
export type FormWidth = z.infer<typeof FormWidthSchema>;
/*

***Documentation on how the visiblity conditions work***

type PrefixKeys<Type, Prefix extends string> = {
  [Key in keyof Type as `${Prefix}${Key extends string ? Key : ''}`]: Type[Key];
};

type TruthinessCondition =
  | string // checks for truthiness in the field at this key e.g. "is_smoker"
  | `patient.${keyof Patient}` // same thing but checks for a truthy value on the Patient
  | `appointment.${keyof Appointment}`; // same thing but for Appointment

type SpecificValueCondition =
  | Record<string, unknown> // checks for a specific value at a key e.g.  {event_type: 'Change in Therapy'}
  | Partial<PrefixKeys<Patient, 'patient.'>> // check for a specific value on a Patient, e.g. { 'patient.gender': 'm' }
  | Partial<PrefixKeys<Appointment, 'appointment.'>>; // same thing but for Appointment

type VisibilityCondition<Model> = TruthinessCondition<Model> | SpecificValueCondition<Model>;

*/

const FieldDefinitionBaseSchema = z.object({
  title: z.string(),
  width: FormWidthSchema,
  indent: FormWidthSchema.optional(),
  hide_if: z.any().optional(),
  show_if: z.any().optional(),
});

const KeyedFieldDefinitionBaseSchema = z.object({
  ...FieldDefinitionBaseSchema.shape,
  default_value: z.any().optional(),
});

const BooleanFieldDefinitionSchema = z.object({
  ...KeyedFieldDefinitionBaseSchema.shape,
  type: z.enum(["checkbox", "yes_no"]),
});

const CompositeBooleanFieldDefinitionSchema = z.object({
  ...KeyedFieldDefinitionBaseSchema.shape,
  type: z.literal("composite_checkbox"),
  mappings: z.array(z.string()),
});

const DateFieldDefinitionSchema = z.object({
  ...KeyedFieldDefinitionBaseSchema.shape,
  type: z.enum(["date", "date_time"]),
  required: z.boolean().optional(),
  disable_future: z.boolean().optional(),
  disable_past: z.boolean().optional(),
  must_be_before: z.string().optional(),
  must_be_after: z.string().optional(),
});

const SelectFieldDefinitionSchema = z.object({
  ...KeyedFieldDefinitionBaseSchema.shape,
  type: z.literal("select"),
  options: z.array(z.string()),
  multiple: z.boolean().optional(),
  required: z.boolean().optional(),
});

const DocumentFieldDefinitionSchema = z.object({
  type: z.literal("document"),
});

export const FreeTextFieldDefinitionSchema = z.object({
  ...KeyedFieldDefinitionBaseSchema.shape,
  type: z.literal("text"),
  rows: z.number().optional(),
  required: z.boolean().optional(),
  max_length: z.number().optional(),
});

const NumberFieldDefinitionSchema = z.object({
  ...KeyedFieldDefinitionBaseSchema.shape,
  type: z.literal("number"),
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

const RadioButtonFieldDefinitionSchema = z.object({
  ...KeyedFieldDefinitionBaseSchema.shape,
  type: z.literal("radio"),
  options: z.array(z.string()),
  required: z.boolean().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { title: _, ...withoutTitle } = FieldDefinitionBaseSchema.shape;
const TypographyDefinitionSchema = z.object({
  ...withoutTitle,
  type: z.enum(["title", "subtitle", "paragraph"]),
  content: z.string(),
  helper_text: z.string().optional(),
});

export const FieldDefinitionSchema = z.discriminatedUnion("type", [
  TypographyDefinitionSchema,
  BooleanFieldDefinitionSchema,
  CompositeBooleanFieldDefinitionSchema,
  DateFieldDefinitionSchema,
  SelectFieldDefinitionSchema,
  DocumentFieldDefinitionSchema,
  FreeTextFieldDefinitionSchema,
  NumberFieldDefinitionSchema,
  RadioButtonFieldDefinitionSchema,
]);

export const RowSchema = z.object({
  fields: z.array(FieldDefinitionSchema),
  indent: FormWidthSchema.optional(),
});

const UntitledSectionSchema = z.object({
  rows: z.array(RowSchema),
});

const TitledSectionSchema = z.object({
  ...UntitledSectionSchema.shape,
  title: z.string(),
  collapsible: z.boolean().optional(),
});

export const SectionSchema = z.union([
  UntitledSectionSchema,
  TitledSectionSchema,
]);
export const FormSchema = z.object({
  title: z.string(),
  model: z.string(),
  sections: z.array(SectionSchema),
});
