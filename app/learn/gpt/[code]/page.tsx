
import { YoutubeTranscript } from 'youtube-transcript';
import styles from "./page.module.css";
import OpenAI from 'openai';


import {createSupabaseServerClient} from "app/utils/supabase/server";
import { create } from '@mui/material/styles/createTransitions';
import { revalidatePath } from 'next/cache';


//const model = "gpt-3.5-turbo"
const model = "gpt-4"

// console.log("Open Api Key", process.env.OPENAI_API_KEY );

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

async function getTranscript(url: string): Promise<{ error: string | null, transcript: string | null}>{
  
  try{
    
    const response = await YoutubeTranscript.fetchTranscript(url);
  
    const transcript = response.reduce((prev, curr) => prev + curr.text, "")
  
    return {error: null, transcript};

  } catch (error) {
    
    console.error(error);

    return {error: (error as Error).message, transcript: null}
  }
    
}

async function getSummary(transcript: string) {

  try {

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {"role": "system", "content": 'Be a computer science teacher, teaching GCSE computer science.'},
        {"role": "user", "content": 'here is a transcript of a video ' },
        {"role": "user", "content": transcript},
        {"role": "user", "content" : "Provide a summary of the transcript, aimed at a reading age of 14 years old."}
      ]
    });
  
    return (response.choices[0].message.content);

  } catch (error) {

    console.error(error);

    return null;

  }
      
}

async function getQuestions(transcript: string) {

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {"role": "system", "content": 'Be a computer science teacher, teaching GCSE computer science.'},
      {"role": "user", "content": 'here is a transcript of a video ' },
      {"role": "user", "content": transcript},
      {"role": "user", "content": 'Create a multiple choice question and answer to test the pupils understanding of the text.'},
      
    ],
    // stream: true,
    functions: [
      {
        name: "create_multiple_choice_question",
        description: "create 5 multiple choice question and correct_answer based on video transcript.  Ensure that only 1 correct answer per question.",
        parameters: {
          type: "object",
          required: ["questions", "correct_answers", "choices"],
          properties: {
            "questions": {
              "type" : "array",
              "items": {
                type: "string"
              },
              "description": "The question texts. Identify each question text with [ ]."
            },

            "choices" : {
              "type" : "array",
              "items": {
                type: "string"
              },
              "description" : 'the choices of each question. identify each choice with [ ].'
            },
            
            "correct_answers":{
              "type" : "array",
              "items": {
                type: "array",
                "items" : {
                  type: "string"
                },
              },
              description: "the correct answers for each question."
            },
          }
        }
      }
    ],
    function_call:"auto"
    
  });

if (!response || !response.choices)
  return null;

const args = JSON.parse(response?.choices[0]?.message?.function_call?.arguments || "");

return args;
}

async function getSummaryMock(transcript: string): Promise<string> {

  const summaryText = `The video explains how a computer works. A computer is an electronic device that receives an input, processes that input, and gives an output. For instance, when you're playing a game on a console, your game controller's buttons provide the input, the console processes these inputs, and the output is the game's response on the screen. 

  Inside the computer, there are two main parts – the memory, which stores the program, and the Central Processing Unit (or CPU). The CPU is like the computer's brain as it carries out the program's instructions. These instructions are carried out in a loop known as the 'fetch-execute cycle', which repeats billions of times a second. 
  
  In this cycle, the computer fetches the next instruction from its memory and brings it back to the CPU. The CPU then decodes or interprets the instruction to know what to do. Once it understands the instruction, the CPU executes it. The execute phase could involve different tasks depending on the instruction, like retrieving data from the memory, doing a calculation, or sending data back to the memory.
  
  The frequency at which the CPU does these cycles is called the 'clock speed' and is measured in Hertz. One Hertz means the CPU is doing one cycle per second. They also mention that they'll be diving deeper into how all this works in future videos.`
  
  return new Promise((res, rej) => {
    res(summaryText);
  })
}

async function getQuestionsMock(transcript: string)
{
  const questionText = {
    "questions": [
      "What is a computer defined as?",
      "What are the key components of a desktop computer?",
      "What are the stages of the fetch execute cycle?",
      "What does the instruction execution in the CPU could involve?",
      "What is clock speed measured in?"
    ],
    "choices": [
      [
        "An electronic device that takes an input, processes data, and delivers output",
        "A programming language",
        "An output device",
        "A storage device"
      ],
      [
        "The CPU and the Memory",
        "The CPU and the Hard disk",
        "The Memory and the Monitor",
        "The Keyboard and the Printer"
      ],
      [
        "Fetching instruction, decoding it and executing it",
        "Inputting, processing and outputting data",
        "Storing, processing and decoding data",
        "None of above"
      ],
      [
        "Perform calculation, store information in the memory, get some data from memory",
        "Connect to internet, Fetch data from hard disk, Perform calculation",
        "Fetch data from keyboard, Send data to monitor, Perform calculation",
        "All of above"
      ],
      [
        "Hertz",
        "MegaHertz",
        "GigaHertz",
        "TeraHertz"
      ]
    ],
    "correct_answers": [
      [
        "An electronic device that takes an input, processes data, and delivers output"
      ],
      [
        "The CPU and the Memory"
      ],
      [
        "Fetching instruction, decoding it and executing it"
      ],
      [
        "Perform calculation, store information in the memory, get some data from memory"
      ],
      [
        "Hertz"
      ]
    ]
  }
  
  return new Promise((res, rej) => setTimeout(()=> {
    res(questionText);
  }, 1000))
}

  



const Page = async ({params}: {params: {code: string}}) => {

  try {
    console.log(params);
    const {code} = params;

    // const code = 'mUxgOlnwoHo';
    const url = `https://youtu.be/${code}`;
    const embedUrl = `https://www.youtube.com/embed/${code}`;
    
    const {transcript, error} = await getTranscript(url);

    if (error || transcript == null){
      return <h1>Error message: {error}</h1>
    }
    // const summary = await getSummary(transcript);
    // const questions = await getQuestions(transcript);

    //const summary = await getSummaryMock(transcript);
    //const questions = await getQuestionsMock(transcript);

    //const supabase = createSupabaseServerClient(false);

    //if (!supabase)
    //  return <h1>Error creating supabase</h1>

    //const {data:pageData, error: pageError} = await supabase?.from("dqPage").select("id, summary").eq("id", code);

    //pageError && console.error(pageError);

    //let summaryText = ''
    //if (pageData?.length == 0 && transcript)
   // {
   //   console.log("Updating Cache")
      // get cache
    //  const {transcript, error} = await getTranscript(url);

     // if (error || transcript === null){
     //   return <h1>Error message: {error}</h1>
     // }

      // get summary
     // summaryText = await getSummary(transcript) || "";
     // console.log("Updating");
      // cache to database
     // const {data:insertData, error: insertError} = await supabase?.from("dqPage").insert({id: code, summary: summaryText});
    //} else {
    //  console.log("Using from cache")
     // summaryText = pageData && pageData[0].summary;
    //}

    //attempt to load questions for page
    //const {data: questionsData, error: questionsError} = await supabase?.from("dqQuestions").select("id, question_text, choices, correct_answer").eq("pageId", code);

    //questionsError && console.error(questionsError);

    //if (questionsData && questionsData.length == 0 && transcript != null){

    //  console.log("No questions found in cache, updating...")
    //  const qData = await getQuestions(transcript);

      //@ts-ignore
    //  const updateObj = qData.questions.map((q, i) => ({pageId: code, question_text: q, choices: qData.choices[i], correct_answer: qData.correct_answers[i]}));
    //  console.log(updateObj)
    //  const {data: insertQuestionData, error: insertQuestionError} = await supabase?.from("dqQuestions").insert(updateObj);

    //  insertQuestionError && console.error(insertQuestionError);

    //  revalidatePath(`/learn/gpt/${code}`);

    //}



    return <div className={styles.layout}>
    <h1>Chat GPT</h1>
    <div>
    <iframe width="560" height="315" 
            src={embedUrl} title="YouTube video player"  
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen>
    </iframe>
    </div>
    <div className={styles.transcript}>{transcript}</div>
    
    <div>
      <pre>{// JSON.stringify(questionsData, null, 2)
      }</pre>
    </div>
    </div>
  } catch (error) {
      console.error(error)
      return null;
  }
    
}

export default Page;


const DisplayQuestion = ({questionText, choices, answer} : {questionText: string, choices: string[], answer: string}) => {

  return <div>
    <div>{questionText}</div>
    <ul>
    {choices.map ((c, i) => <li key={i}>{c}</li>)}
    </ul>
    <div>{answer}</div>
    
  </div>
}