
import React from "react";
import { CodeBlock } from "../components/chat/CodeBlock";

//   const lines = text.split("\n");
//   const elements = [];
//   let buffer = [];
//   let inCodeBlock = false;
//   let codeLang = "";
//   let codeBuffer = [];

//   const pushParagraph = () => {
//     if (buffer.length > 0) {
//       elements.push(
//         <p key={elements.length} className="my-2">
//           {buffer.join(" ")}
//         </p>
//       );
//       buffer = [];
//     }
//   };

//   lines.forEach((line, i) => {
//     // Code block start
//     if (line.startsWith("```")) {
//       if (!inCodeBlock) {
//         inCodeBlock = true;
//         codeLang = line.replace(/```/, "").trim() || "code";
//         codeBuffer = [];
//       } else {
//         // Code block end
//         inCodeBlock = false;
//         elements.push(
//           <CodeBlock
//             key={elements.length}
//             code={codeBuffer.join("\n")}
//             lang={codeLang}
//           />
//         );
//       }
//       return;
//     }

//     if (inCodeBlock) {
//       codeBuffer.push(line);
//       return;
//     }

//     // Bullet list
//     if (/^\s*[-*]\s+/.test(line)) {
//       pushParagraph();
//       const content = line.replace(/^\s*[-*]\s+/, "");
//       elements.push(
//         <div
//           key={elements.length}
//           className="flex gap-3 items-start my-1"
//         >
//           <span className="text-lg leading-none">•</span>
//           <span className="flex-1">{content}</span>
//         </div>
//       );
//       return;
//     }

//     // Numbered list
//     if (/^\s*\d+\.\s+/.test(line)) {
//       pushParagraph();
//       const [, num, content] = line.match(/^(\d+)\.\s+(.+)/);
//       elements.push(
//         <div
//           key={elements.length}
//           className="flex gap-3 items-start my-1"
//         >
//           <span className="font-medium min-w-[1.5em]">{num}.</span>
//           <span className="flex-1">{content}</span>
//         </div>
//       );
//       return;
//     }

//     // Normal text (collect in buffer)
//     buffer.push(line);
//   });

//   pushParagraph(); // flush remaining

//   return elements;
// };


// inline formatting helper

function formatInline(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  // Regex to detect inline formatting
  const regex =
    /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/;

  while (remaining.length > 0) {
    const match = remaining.match(regex);

    if (!match) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    // Text before match
    if (match.index > 0) {
      parts.push(
        <span key={key++}>{remaining.slice(0, match.index)}</span>
      );
    }

    if (match[2]) {
      // Bold
      parts.push(
        <strong key={key++} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Italic
      parts.push(
        <em key={key++} className="italic">
          {match[3]}
        </em>
      );
    } else if (match[4]) {
      // Inline code
      parts.push(
        <code
          key={key++}
          className="bg-black/20 px-1.5 py-0.5 rounded-md font-mono text-[13px]"
        >
          {match[4]}
        </code>
      );
    } else if (match[5] && match[6]) {
      // Link
      parts.push(
        <a
          key={key++}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {match[5]}
        </a>
      );
    }

    remaining = remaining.slice(match.index + match[0].length);
  }

  return parts;
}

export const formatMessage = (text) => {
  const lines = text.split("\n");
  const elements = [];
  let buffer = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeBuffer = [];

  const pushParagraph = () => {
    if (buffer.length > 0) {
      elements.push(
        <p key={elements.length} className="my-2">
          {formatInline(buffer.join(" "))}
        </p>
      );
      buffer = [];
    }
  };

  lines.forEach((line) => {
    // Code block start/end
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.replace(/```/, "").trim() || "code";
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        elements.push(
          <CodeBlock
            key={elements.length}
            code={codeBuffer.join("\n")}
            lang={codeLang}
          />
        );
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Bullets
    if (/^\s*[-*]\s+/.test(line)) {
      pushParagraph();
      const content = line.replace(/^\s*[-*]\s+/, "");
      elements.push(
        <div key={elements.length} className="flex gap-3 items-start my-1">
          <span className="text-lg leading-none">•</span>
          <span className="flex-1">{formatInline(content)}</span>
        </div>
      );
      return;
    }

    // Numbered
    if (/^\s*\d+\.\s+/.test(line)) {
      pushParagraph();
      const [, num, content] = line.match(/^(\d+)\.\s+(.+)/);
      elements.push(
        <div key={elements.length} className="flex gap-3 items-start my-1">
          <span className="font-medium min-w-[1.5em]">{num}.</span>
          <span className="flex-1">{formatInline(content)}</span>
        </div>
      );
      return;
    }

    // Normal line
    buffer.push(line);
  });

  pushParagraph();
  return elements;
};


