const app = {
    modelProvider: "OLLAMA",
    model: "phi3"
}

async function chatInputFormSubmitEventHandler(event){
    event.preventDefault();
    const chatInputTextElement = document.getElementById('chat-input-text');
    let rawUserMessage = chatInputTextElement.value;
    let trimmedUserMessage = rawUserMessage.trim();
    createUserMessageDivElement(trimmedUserMessage);
    chatInputTextElement.value = '';
    let assistantMessage = await callChatCompletionAPI(trimmedUserMessage);
    if(assistantMessage === null || assistantMessage === ""){
        createAssistantMessageDivElement("Sorry could not fetch the response, pls ask again");
    }else{
        createAssistantMessageDivElement(assistantMessage);
    }
}

async function callChatCompletionAPI(userMessage){
    const response = await fetch('/api/v1/chat',{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: app.model,
            modelProvider: app.modelProvider,
            message: userMessage
        })
    });
    if(!response.ok){
        console.log("Chat Completion API failed with status code:", response.status);
        return null;
    }else{
        let data = await response.json();
        if(data === null){
            console.log("Received empty response from chat completion API")
            return null;
        }
        let assistantMessage = data?.message?? null;
        return assistantMessage;
    }
}

function clearChatWindow(){
    const chatMessageContainerElement = document.getElementById('chat-message-container');
    chatMessageContainerElement.replaceChildren();
}

function createUserMessageDivElement(userMessage){
    const chatMessageContainerElement = document.getElementById('chat-message-container');
    const userMessageDivElement = document.createElement('div');
    userMessageDivElement.className = 'user-message';
    const spanElement = document.createElement('span');
    spanElement.textContent = userMessage;
    userMessageDivElement.appendChild(spanElement);
    chatMessageContainerElement.appendChild(userMessageDivElement);
}

function createAssistantMessageDivElement(assistantMessage){
    const chatMessageContainerElement = document.getElementById('chat-message-container');
    const assistantMessageDivElement = document.createElement('div');
    assistantMessageDivElement.className = 'assistant-message';
    const spanElement = document.createElement('span');
    spanElement.textContent = assistantMessage;
    assistantMessageDivElement.appendChild(spanElement);
    chatMessageContainerElement.appendChild(assistantMessageDivElement);
}

function startApp(){
    const chatInputFormElement = document.getElementById('chat-input-form');
    chatInputFormElement.addEventListener('submit', chatInputFormSubmitEventHandler);
    clearChatWindow();
}

startApp();