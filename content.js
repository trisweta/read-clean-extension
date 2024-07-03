//iife
(async () => {
    async function fetchProcessedContent(url) {
        try {
            const response = await fetch('http://localhost:3000/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch processed content');
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching processed content:', error);
            throw error;
        }
    }

    const url = window.location.href;

    try {
        const { content, style } = await fetchProcessedContent(url);
        document.head.innerHTML = style;
        document.body.innerHTML = content;
    } catch (error) {
        console.error('Error processing content:', error);
    }
})();
