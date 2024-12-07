document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('url-form');
    const sourceCode = document.querySelector('#source code');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = document.getElementById('url').value;

        try {
            const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();

            // Escape HTML to prevent XSS
            const escapedHtml = html
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');

            sourceCode.textContent = escapedHtml;
            Prism.highlightElement(sourceCode);

            // Add dynamic parameters for pagination
            const urlObj = new URL(window.location.href);
            urlObj.searchParams.set('url', url);
            window.history.pushState({}, '', urlObj);

        } catch (error) {
            console.error('Error:', error);
            sourceCode.textContent = 'Error fetching source code. Please try again.';
        }
    });

    // Implement "People Also Ask" feature
    const peopleAlsoAsk = [
        "How to view source code of a website?",
        "What is the best tool for analyzing web page code?",
        "How to inspect HTML and CSS of a webpage?",
        "What are the benefits of viewing source code?",
    ];

    const paaContainer = document.createElement('div');
    paaContainer.id = 'people-also-ask';
    paaContainer.innerHTML = `
        <h3>People Also Ask</h3>
        <ul>
            ${peopleAlsoAsk.map(question => `<li>${question}</li>`).join('')}
        </ul>
    `;

    document.querySelector('main').appendChild(paaContainer);

    // Add a comments section
    const commentsSection = document.createElement('section');
    commentsSection.id = 'comments';
    commentsSection.innerHTML = `
        <h3>Comments</h3>
        <div id="disqus_thread"></div>
    `;

    document.querySelector('main').appendChild(commentsSection);

    // Load Disqus
    const disqusScript = document.createElement('script');
    disqusScript.src = 'https://view-source.disqus.com/embed.js';
    disqusScript.setAttribute('data-timestamp', +new Date());
    (document.head || document.body).appendChild(disqusScript);
});

