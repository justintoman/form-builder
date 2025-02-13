import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { FormSchema } from "./schema";
import { z } from "zod";
import { Section } from "./Section";

export function Form() {
  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const sections = useFieldArray({
    name: "sections",
    control: methods.control,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <label className="flex items-start flex-col space-y-2">
          <span>Title</span>
          <input {...methods.register("title")} />
        </label>
        {sections.fields.map((section, index) => (
          <div key={section.id}>
            {"title" in section ? (
              <div className="flex flex-row space-x-4">
                <label className="flex items-start flex-row space-y-2">
                  <span>Title</span>
                  <input {...methods.register(`sections.${index}.title`)} />
                </label>
                <label className="flex items-start flex-col space-x-2">
                  <span>Collapsible?</span>
                  <input
                    type="checkbox"
                    {...methods.register(`sections.${index}.collapsible`)}
                  />
                </label>
              </div>
            ) : (
              <button>Change to Titled Section</button>
            )}
            <div className="flex flex-row space-x-4">
              <button type="button" onClick={() => sections.remove(index)}>
                X
              </button>
              {index != 0 ? (
                <button
                  type="button"
                  onClick={() => sections.swap(index, index - 1)}
                >
                  Up
                </button>
              ) : null}
              {index != sections.fields.length - 1 ? (
                <button
                  type="button"
                  onClick={() => sections.swap(index, index + 1)}
                >
                  Down
                </button>
              ) : null}
            </div>
            {<Section index={index} />}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            sections.append({ title: "Untitled", collapsible: false, rows: [] })
          }
        >
          Add Section
        </button>
      </form>
    </FormProvider>
  );
}
