import { TextField, Button, Stack, Select, MenuItem } from "@mui/material";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";

type FormValues = {
  year: string;
  questions: {
    questionNumber: string;
    marks: number;
    specId: number;
  }[];
};

export const CreateForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      year: "",
      questions: [],
    },
  });

  const { register, handleSubmit, control } = form;

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log(data);
  };

  return (
    <>
      <h1>Data</h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} width={400}>
          <TextField label="Year" type="text" {...register("year")} />
          <button
            onClick={() => {
              append({ questionNumber: "", marks: 0, specId: 0 });
            }}
          >
            Add new
          </button>
          {fields &&
            fields.map((field, index) => (
              <div key={field.id}>
                <TextField
                  label="Question Number"
                  type="text"
                  {...register(`questions.${index}.questionNumber`)}
                />
                <TextField
                  label="Marks"
                  type="number"
                  {...register(`questions.${index}.marks`, {
                    valueAsNumber: true,
                  })}
                />
                <Select
                  label="SpecId"
                  type="number"
                  {...register(`questions.${index}.specId`, {
                    valueAsNumber: true,
                  })}
                >
                  <MenuItem value={0}>Option 1</MenuItem>
                  <MenuItem value={1}>Option 2</MenuItem>
                  <MenuItem value={2}>Option 3</MenuItem>
                </Select>
              </div>
            ))}

          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Stack>
      </form>
    </>
  );
};
