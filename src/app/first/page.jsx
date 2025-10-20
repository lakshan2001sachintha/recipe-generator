'use client';
import { useState } from "react";
import TagInput from "@/components/TagInput";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [ingredientList, setIngredientList] = useState([]); // array form for creative UI
  const [visual, setVisual] = useState(false);
  const [simple, setSimple] = useState(false);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  // Voice input removed per request

  const generateRecipe = async () => {
    setLoading(true);
    setRecipe("");

    try {
      // Join ingredient list + freeform textarea (if user typed there)
      const finalIngredients = [
        ...ingredientList,
        ...ingredients.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
      ]
        .filter(Boolean)
        .filter((v, i, arr) => arr.findIndex(x => x.toLowerCase() === v.toLowerCase()) === i)
        .join(', ');

      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: finalIngredients, visual, simple }),
      });

      const data = await res.json();
      
      if (data.error) {
        setRecipe(`Error: ${data.error}`);
      } else {
        setRecipe(data.recipe);
      }
    } catch (error) {
      setRecipe(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  function cleanRecipeText(text) {
  // Remove markdown headings, bold, italics, and horizontal rules
  return text
    .replace(/^---$/gm, '') // horizontal rules
    .replace(/^#+\s?/gm, '') // markdown headings
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // bold/italic
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/^[>\-]\s?/gm, '') // blockquotes/lists
    .replace(/[^\x00-\x7F]+/g, '') // remove non-ASCII (emojis, CJK, etc.)
    .replace(/^\s*$/gm, ''); // remove empty lines
    
}
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 bg-[url('/images/background.png')] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/images/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
}}

    >
      <h1 className="text-6xl font-bold mb-4 text-orange-500 font-normal">Enter Your Ingredians..</h1>

      {/* Creative input: Tag chips + textarea fallback */}
      <div className="w-full max-w-2xl flex flex-col gap-3 items-center">
        <TagInput value={ingredientList} onChange={setIngredientList} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4 mt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={visual}
            onChange={() => setVisual(!visual)}
            className="hidden peer"
          />
          <div className="w-6 h-6 rounded-lg border-2 border-amber-400 flex items-center justify-center
                          peer-checked:bg-amber-400 transition-all duration-200">
            <svg
              className="hidden w-4 h-4 text-white peer-checked:block"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-amber-50 font-semibold select-none">Visual explanation</span>
        </label>

        {/* Simplify Instructions Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={simple}
            onChange={() => setSimple(!simple)}
            className="hidden peer"
          />
          <div className="w-6 h-6 rounded-lg border-2 border-amber-400 flex items-center justify-center
                          peer-checked:bg-amber-400 transition-all duration-200">
            <svg
              className="hidden w-4 h-4 text-white peer-checked:block"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-amber-50 font-semibold select-none">Simplify instructions</span>
        </label>
      </div>


      <button
        onClick={generateRecipe}
        className="bg-amber-600 text-white px-6 py-2 font-bold rounded-lg hover:bg-amber-700 transition"
        disabled={loading}
      >
        {loading ? "Preparing..." : "Get Your Recipe"}
      </button>

      {recipe && (
        <div className="mt-8 bg-white shadow-lg p-6 rounded-2xl max-w-2xl whitespace-pre-wrap">
          <h2 className="text-2xl font-semibold mb-2 text-amber-700">Your Recipe</h2>
          <p>{cleanRecipeText(recipe)}</p>
        </div>
      )}
    </div>
  );
}
