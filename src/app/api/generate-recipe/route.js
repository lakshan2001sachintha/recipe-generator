// app/api/generate-recipe/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { ingredients, visual, simple } = await req.json();

  if (!ingredients)
    return new Response(JSON.stringify({ error: "No ingredients provided." }), { status: 400 });

  const prompt = `
You are a creative chef AI. Based on these ingredients: ${ingredients}.
Generate a delicious recipe with title, ingredients list, and step-by-step instructions.
${visual ? "Add visual elements (like emojis for steps)." : ""}
${simple ? "Use very simple, beginner-friendly language." : ""}
`;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return new Response(JSON.stringify({ recipe: text }), {
    headers: { "Content-Type": "application/json" },
  });
}
