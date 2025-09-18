import { useState } from "react";

export const CodeBlock =({ code, lang })=> {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full flex flex-col bg-black/30 rounded-lg text-sm my-3">
      <div className="flex justify-between items-center text-xs opacity-70 px-3 py-2">
        <span>{lang}</span>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md"
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>
      <pre className="w-full overflow-x-auto p-3 m-0">
        <code className="block text-sm font-mono whitespace-pre-wrap break-words">
          {code}
        </code>
      </pre>
    </div>
  );
}
