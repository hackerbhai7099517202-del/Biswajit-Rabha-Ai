const BACKEND_URL = "http://localhost:5000/api/chat";

const chatWindow = document.getElementById('chatWindow');
const userInputField = document.getElementById('userInputField');
const finalSendBtn = document.getElementById('finalSendBtn');

if (finalSendBtn) {
    finalSendBtn.addEventListener('click', processUserMessage);
}

if (userInputField) {
    userInputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processUserMessage();
        }
    });
}

async function processUserMessage() {
    const text = userInputField.value.trim();
    if (!text) return; 

    // User Message display karo
    appendMessageToWindow(text, 'user-message');
    userInputField.value = ''; 
    scrollChatToBottom();

    // Typing Indicator dikhao
    const typingIndicatorId = appendTypingIndicator();
    scrollChatToBottom();

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const resultData = await response.json();
        
        // Loading hata do
        const loadingElement = document.getElementById(typingIndicatorId);
        if(loadingElement) loadingElement.remove();

        if (resultData.candidates && resultData.candidates[0].content.parts[0].text) {
            let aiResponseContent = resultData.candidates[0].content.parts[0].text;
            aiResponseContent = aiResponseContent.replace(/\n/g, '<br>');
            aiResponseContent = aiResponseContent.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 

            appendMessageToWindow(aiResponseContent, 'bot-message', true);
        } else if (resultData.error) {
            appendMessageToWindow(`Backend Error: ${resultData.error.message}`, 'bot-message');
        } else {
            appendMessageToWindow("Kshama karein, response generate nahi ho paaya.", 'bot-message');
        }

    } catch (error) {
        console.error(error);
        const loadingElement = document.getElementById(typingIndicatorId);
        if(loadingElement) loadingElement.remove();
        appendMessageToWindow("Error: Backend server se connection nahi ho pa raha hai. Kripya check karein ki server chal raha hai ya nahi.", 'bot-message');
    }

    scrollChatToBottom();
}

function appendMessageToWindow(text, messageType, isHTML = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${messageType}`;
    if(isHTML) {
        messageDiv.innerHTML = text;
    } else {
        messageDiv.innerText = text;
    }
    chatWindow.appendChild(messageDiv);
}

function appendTypingIndicator() {
    const uniqueId = 'typing-' + Date.now();
    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = `message bot-message typing-dots`;
    indicatorDiv.id = uniqueId;
    indicatorDiv.innerHTML = `<span></span> <span></span> <span></span>`;
    chatWindow.appendChild(indicatorDiv);
    return uniqueId;
}

function scrollChatToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
