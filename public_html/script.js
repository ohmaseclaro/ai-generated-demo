document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput  = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Send Message Function
    function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        // Display User Message
        displayMessage(messageText, 'user');

        // Clear Input
        userInput.value = '';

        const startTime = Date.now();

        // Display loading animation
        displayLoadingAnimation();

        // Send message to server
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageText })
        })
        .then(response => response.json())
        .then(data => {
            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(1) + 's';
            removeLoadingAnimation();
            displayMessage(data.response, 'bot', duration);
        })
        .catch(error => {
            console.error('Error:', error);
            removeLoadingAnimation();
            displayMessage('Sorry, something went wrong.', 'bot');
        });
    }

    // Display Message Function
    function displayMessage(message, sender, duration = '') {
        const messageElem = document.createElement('div');
        messageElem.classList.add('message', sender);

        const contentElem = document.createElement('div');
        contentElem.classList.add('message-content');
        contentElem.textContent = message;

        if (sender === 'bot' && duration) {
            const durationElem = document.createElement('div');
            durationElem.classList.add('message-timestamp');
            durationElem.textContent = duration;
            contentElem.appendChild(durationElem);
        }

        messageElem.appendChild(contentElem);
        chatWindow.appendChild(messageElem);

        // Scroll to Bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Display Loading Animation Function
    function displayLoadingAnimation() {
        const loadingElem = document.createElement('div');
        loadingElem.classList.add('loading');

        for (let i = 0; i < 3; i++) {
            const dotElem = document.createElement('div');
            dotElem.classList.add('dot');
            loadingElem.appendChild(dotElem);
        }

        chatWindow.appendChild(loadingElem);

        // Scroll to Bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Remove Loading Animation Function
    function removeLoadingAnimation() {
        const loadingElem = chatWindow.querySelector('.loading');
        if (loadingElem) {
            chatWindow.removeChild(loadingElem);
        }
    }
});