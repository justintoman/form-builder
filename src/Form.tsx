import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { FormSchema } from "./schema";
import { z } from "zod";
import { Section } from "./Section";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export function Form() {
  const methods = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      title: "New Form",
      sections: [
        {
          title: "Section 1",
          collapsible: false,
          rows: [{ fields: [{ type: "text", width: 4, title: "Field 1" }] }],
        },
      ],
    },
    resolver: zodResolver(FormSchema),
  });

  const sections = useFieldArray({
    name: "sections",
    control: methods.control,
  });

  return (
    <FormProvider {...methods}>
      <form
        className="space-y-4"
        onSubmit={methods.handleSubmit((data) => console.log(data))}
      >
        <div className="flex flex-row justify-between">
          <Label className="flex items-start flex-col space-y-1">
            <span className="text-sm font-bold">Form Title</span>
            <Input {...methods.register("title")} />
          </Label>
          <Button onClick={() => console.log(methods.getValues())}>
            Debug
          </Button>
        </div>
        {sections.fields.map((section, index) => (
          <div key={section.id}>
            <Section
              index={index}
              section={section}
              canMoveUp={index !== 0}
              canMoveDown={index != sections.fields.length - 1}
              onDelete={() => sections.remove(index)}
              onMoveUp={() => sections.swap(index, index - 1)}
              onMoveDown={() => sections.swap(index, index + 1)}
              onToggleTitledSection={(titled) =>
                sections.update(
                  index,
                  titled
                    ? {
                        title: "",
                        collapsible: false,
                        rows: section.rows,
                      }
                    : { rows: section.rows }
                )
              }
            />
          </div>
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            sections.append({
              title: "New Section",
              collapsible: false,
              rows: [
                { fields: [{ type: "text", width: 4, title: "Field 1" }] },
              ],
            })
          }
        >
          Add Section
        </Button>
      </form>
    </FormProvider>
  );
}
