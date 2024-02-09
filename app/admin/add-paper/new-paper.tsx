import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useState, useEffect } from "react";
import React from "react";
import { useSupabase } from "components/context/supabase-context";

type FormValues = {
  SpecId: number;
  year: string,
  month: string,
  title: string,
  paper: string, 
  subject: string,
  marks: number,
  questions: {
    question_number: string;
    marks: number;
    specItemId: number;
    question_order: number;
  }[];
};

const PaperForm = ({
  paper,
  onPaperChange,
}: {
  paper: any;
  onPaperChange: (paper: any) => void;
}) => {
  const [specId, setPaperId] = useState(0);
  const [options, setOptions] = useState([
    <option value={1} key={0}>
      Item 1
    </option>,
    <option value={2} key={1}>
      Item 2
    </option>,
    <option value={3} key={2}>
      Item 3
    </option>,
  ]);

  const { register, getValues, handleSubmit, watch, control, formState } =
    useForm<FormValues>({
      mode: "onBlur",
      defaultValues: {
        SpecId: 0,
        year: "",
        month: "",
        title: "",
        paper: "",
        marks: 0,
        questions: [
          {
            question_number: "",
            marks: 0,
            specItemId: 0,
            question_order: 0,
          },
        ],
      },
    });

  const { errors, isDirty } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "questions",
    control,
  });

  const {supabase} = useSupabase();

  const onSubmit = (data: FormValues) => {
    console.log(onPaperChange);
    onPaperChange(data);
  };

  /*
    useEffect(() => {
      const subscription = watch((value, { name, type }) =>
        console.log(value, name, type)
      );
      return () => subscription.unsubscribe();
    }, [watch]);
    */

  const updatePaperId = () => {
    const values = getValues();
    console.log("Form Values are: ", values);
    setPaperId(values.SpecId);
  };

  const loadSpecItems = async(paperId: number) => {

    const {data: specItems, error} = await supabase.from("SpecItem").select ("id, tag, title").eq("SpecId", paperId);

    if (error) {
      console.error(error);
      return [];
    }

    setOptions(specItems.map((si, i) => <option key={si.id} value={si.id}>{`${si.tag} ${si.title}`}</option>));
    
  }

  useEffect(() => {
    
    loadSpecItems(specId)

  }, [specId]);

  return (
    <>
      <h1>Paper Form</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>Spec Id:</label>
        <input
          type="number"
          id="SpecId"
          {...register("SpecId", {
            onBlur: updatePaperId,
            required: {
              value: true,
              message: "SpecId is required",
            },
          })}
        ></input>


        <label>Year:</label>
        <input
          type="text"
          id="year"
          {...register("year", {
            
            required: {
              value: true,
              message: "year is required",
            },
          })}
        ></input>

        <label>Month:</label>
        <input
          type="text"
          id="year"
          {...register("month", {
            
            required: {
              value: true,
              message: "month is required",
            },
          })}
        ></input>

        <label>Paper:</label>
        <input
          type="text"
          id="paper"
          {...register("paper", {
            
            required: {
              value: true,
              message: "paper is required",
            },
          })}
        ></input>

        <label>Title:</label>
        <input
          type="text"
          id="title"
          {...register("title", {
            
            required: {
              value: true,
              message: "title is required",
            },
          })}
        ></input>


<label>Marks:</label>
        <input
          type="number"
          id="marks"
          {...register("marks", {
            
            required: {
              value: true,
              message: "marks are required",
            },
          })}
        ></input>



        <div>Questions</div>
        <div>
          {fields.sort((a, b) => {return a.question_number > b.question_number ? 1 : -1})
                 .map((field, index) => {
            return (
              <div key={field.id}>
                <input
                  {...register(`questions.${index}.question_number` as const)}
                ></input>
                <input
                  {...register(`questions.${index}.marks` as const)}
                ></input>

                <select {...register(`questions.${index}.specItemId` as const)}>
                  {options}
                </select>
                <input
                  {...register(`questions.${index}.question_order` as const)}
                ></input>

                {index > 0 && (
                  <button
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}

          <button
            onClick={() => {
              append({
                question_number: "",
                marks: 0,
                specItemId: 0,
                question_order: 0,
              });
            }}
          >
            Add Quesiton
          </button>
        </div>

        <button type="submit">Save</button>
      </form>
      <div>{JSON.stringify(isDirty)}</div>
      <DevTool control={control} />
    </>
  );
};

export default PaperForm;
