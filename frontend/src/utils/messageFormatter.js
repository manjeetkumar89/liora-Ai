export const formatMessage = (text) => {
  // Simple markdown-like formatting
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const inlineCodeRegex = /`([^`]+)`/g;
  const bulletRegex = /^\s*[-*]\s(.+)$/gm;
  const numberRegex = /^\s*(\d+)\.\s(.+)$/gm;

  let formattedText = text
    .replace(codeBlockRegex, (match, code) => `
      <pre class="bg-black/20 p-4 rounded-lg my-2 overflow-x-auto">
        <code>${code.trim()}</code>
      </pre>
    `)
    .replace(inlineCodeRegex, '<code class="bg-black/20 px-1.5 py-0.5 rounded">$1</code>')
    .replace(bulletRegex, '<div class="flex gap-2">•<span>$1</span></div>')
    .replace(numberRegex, '<div class="flex gap-2"><span>$1.</span><span>$2</span></div>');

  return { __html: formattedText };
};
