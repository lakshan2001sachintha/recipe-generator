'use client';
import { useState, useRef, useEffect } from 'react';

/**
 * TagInput
 * - value: string[] current tags
 * - onChange: (tags: string[]) => void
 * - placeholder?: string
 */
export default function TagInput({ value = [], onChange, placeholder = 'Add ingredient and press Enter or ,', disabled = false }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Ensure input remains empty if disabled
    if (disabled) setInput('');
  }, [disabled]);

  const addTokens = (raw) => {
    if (!raw) return;
    const tokens = raw
      .split(/[\n,]+|\band\b/gi)
      .map(t => t.trim())
      .filter(Boolean);

    if (!tokens.length) return;

    // de-duplicate, case-insensitive compare but preserve original casing
    const existingLower = new Set(value.map(v => v.toLowerCase()));
    const merged = [...value];
    tokens.forEach(t => {
      if (!existingLower.has(t.toLowerCase())) {
        merged.push(t);
        existingLower.add(t.toLowerCase());
      }
    });
    onChange?.(merged);
  };

  const removeAt = (idx) => {
    const next = value.filter((_, i) => i !== idx);
    onChange?.(next);
  };

  const onKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (input.trim()) {
        addTokens(input);
        setInput('');
      }
    } else if (e.key === 'Backspace' && !input) {
      // remove last tag when input empty
      if (value.length > 0) removeAt(value.length - 1);
    }
  };

  const onPaste = (e) => {
    const text = e.clipboardData.getData('text');
    if (text && /,|\n/.test(text)) {
      e.preventDefault();
      addTokens(text);
    }
  };

  const onBlur = () => {
    if (input.trim()) {
      addTokens(input);
      setInput('');
    }
  };

  return (
    <div className={`w-full max-w-lg min-h-[46px] bg-white rounded-lg border flex flex-wrap items-center gap-2 p-2 ${disabled ? 'opacity-60' : ''}`}
         onClick={() => inputRef.current?.focus()}
         aria-label="Ingredients input as tags">
      {value.map((tag, idx) => (
        <span key={idx} className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm">
          {tag}
          <button type="button" className="hover:text-amber-900" onClick={(e) => { e.stopPropagation(); removeAt(idx); }} aria-label={`Remove ${tag}`}>
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 min-w-[140px] outline-none bg-transparent text-black placeholder-gray-400"
      />
    </div>
  );
}
