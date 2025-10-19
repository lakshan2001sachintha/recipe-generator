'use client';
import { useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [visual, setVisual] = useState(false);
  const [simple, setSimple] = useState(false);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    setLoading(true);
    setRecipe("");

    const res = await fetch("/api/generate-recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients, visual, simple }),
    });

    const data = await res.json();
    setRecipe(data.recipe);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <h1 className="text-4xl font-bold mb-4 text-amber-800">🍳 Recipe Generator</h1>

      <textarea
        className="w-full max-w-lg border rounded-lg p-3 mb-3 text-gray-700"
        rows="3"
        placeholder="Enter ingredients (e.g., chicken, rice, garlic)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={visual}
            onChange={() => setVisual(!visual)}
          />
          Visual explanation
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={simple}
            onChange={() => setSimple(!simple)}
          />
          Simplify instructions
        </label>
      </div>

      <button
        onClick={generateRecipe}
        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

      {recipe && (
        <div className="mt-8 bg-white shadow-lg p-6 rounded-2xl max-w-2xl whitespace-pre-wrap">
          <h2 className="text-2xl font-semibold mb-2 text-amber-700">Your Recipe</h2>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
}
