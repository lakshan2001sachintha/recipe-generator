// app/api/generate-recipe/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { ingredients, visual, simple } = await req.json();

    console.log("Received ingredients:", ingredients);
    console.log("API Key exists:", !!process.env.GEMINI_API_KEY);

    if (!ingredients)
      return new Response(JSON.stringify({ error: "No ingredients provided." }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });

    const prompt = `
You are a creative chef AI. Based on these ingredients: ${ingredients}.
Generate a delicious recipe with title, ingredients list, and step-by-step instructions.
${visual ? "Add visual elements (like emojis for steps)." : ""}
${simple ? "Use very simple, beginner-friendly language." : ""}
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("Calling Gemini API...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Recipe generated successfully");

    return new Response(JSON.stringify({ recipe: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    console.error("Error details:", error.message, error.status);
    return new Response(JSON.stringify({ error: error.message || "Failed to generate recipe" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
