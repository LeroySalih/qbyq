import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Can be 'nodejs'
export const runtime = 'edge';
 
const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});
// This method must be named GET
export async function GET() {
  // Make a request to OpenAI's API based on
  // a placeholder prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [{ role: 'user', content: 'Be a English Teacher, teaching GCSE pupils about Gorge Orwell.   Give me a summary of the first 10 paragraphs of the book 1984' }],
  });
  // Log the response
  //for await (const part of response) {
  //  console.log(part.choices[0].delta);
 // }
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}