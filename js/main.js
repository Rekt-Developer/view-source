document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('url-form');
    const sourceCode = document.querySelector('#source code');
    const languageTabs = document.getElementById('language-tabs');
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Code';
    copyButton.className = 'copy-button';
    document.querySelector('#output-section').appendChild(copyButton);

    let htmlContent = '';
    let cssContent = '';
    let jsContent = '';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = document.getElementById('url').value;

        try {
            const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();

            // Parse HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract HTML, CSS, and JavaScript
            htmlContent = doc.documentElement.outerHTML;
            cssContent = Array.from(doc.getElementsByTagName('style')).map(style => style.textContent).join('\n');
            jsContent = Array.from(doc.getElementsByTagName('script')).map(script => script.textContent).join('\n');

            // Display HTML content by default
            displayCode('html');

            // Add dynamic parameters for pagination
            const urlObj = new URL(window.location.href);
            urlObj.searchParams.set('url', url);
            window.history.pushState({}, '', urlObj);

        } catch (error) {
            console.error('Error:', error);
            sourceCode.textContent = 'Error fetching source code. Please try again.';
        }
    });

    languageTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab')) {
            const language = e.target.dataset.language;
            displayCode(language);
        }
    });

    function displayCode(language) {
        let content = '';
        let codeClass = '';

        switch (language) {
            case 'html':
                content = htmlContent;
                codeClass = 'language-html';
                break;
            case 'css':
                content = cssContent;
                codeClass = 'language-css';
                break;
            case 'js':
                content = jsContent;
                codeClass = 'language-javascript';
                break;
        }

        sourceCode.className = codeClass;
        sourceCode.textContent = content;
        Prism.highlightElement(sourceCode);

        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`.tab[data-language="${language}"]`).classList.add('active');
    }

    copyButton.addEventListener('click', () => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = sourceCode.textContent;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = 'Copy Code';
        }, 2000);
    });

    // Implement "People Also Ask" feature
    const peopleAlsoAsk = [
        "How to view source code of a website?",
        "What is the best tool for analyzing web page code?",
        "How to inspect HTML and CSS of a webpage?",
        "What are the benefits of viewing source code?",
        "How to use Advanced View Source for SEO analysis?",
        "Can I view JavaScript code with Advanced View Source?",
        "Is Advanced View Source free to use?",
        "How often is Advanced View Source updated?",
    ];

    const paaContainer = document.getElementById('people-also-ask');
    const paaList = document.createElement('ul');
    peopleAlsoAsk.forEach(question => {
        const li = document.createElement('li');
        li.textContent = question;
        paaList.appendChild(li);
    });
    paaContainer.appendChild(paaList);

    // Load Disqus
    const disqusScript = document.createElement('script');
    disqusScript.src = 'https://advanced-view-source.disqus.com/embed.js';
    disqusScript.setAttribute('data-timestamp', +new Date());
    (document.head || document.body).appendChild(disqusScript);

    // Implement infinite scroll for blog posts
    let page = 1;
    const blogContainer = document.createElement('section');
    blogContainer.id = 'blog-posts';
    document.querySelector('main').insertBefore(blogContainer, document.getElementById('comments'));

    async function loadBlogPosts() {
        const response = await fetch(`/api/blog-posts?page=${page}`);
        const posts = await response.json();
        posts.forEach(post => {
            const article = document.createElement('article');
            article.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="/blog/${post.slug}">Read more</a>
            `;
            blogContainer.appendChild(article);
        });
        page++;
    }

    // Initial load of blog posts
    loadBlogPosts();

    // Implement infinite scroll
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            loadBlogPosts();
        }
    });
});

