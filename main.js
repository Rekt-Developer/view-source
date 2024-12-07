document.getElementById('sourceForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const url = document.getElementById('url').value;
  const sourceCodeElement = document.getElementById('sourceCode');
  const copyBtn = document.getElementById('copyBtn');

  sourceCodeElement.textContent = 'Fetching source...';
  try {
    const response = await fetch(`/view-source-api?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error('Failed to fetch source');
    
    const sourceCode = await response.text();
    sourceCodeElement.textContent = sourceCode;

    // Apply syntax highlighting
    hljs.highlightElement(sourceCodeElement);

    // Enable copy button
    copyBtn.style.display = 'block';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(sourceCode);
      alert('Source code copied to clipboard!');
    });
  } catch (error) {
    sourceCodeElement.textContent = `Error: ${error.message}`;
  }
});
