// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             showSettings: false,
//             chatHistory: [],
//             currentChat: null,
//             models: [],
//             selectedModel: null,
//             userInput: "",
//             chatContent: [],
//             chatThreads: [],
//             currentThreadIndex: -1,
//         };
//         this.settingsButtonRef = React.createRef();
//     }

//     toggleSettings = () => {
//         this.setState({ showSettings: !this.state.showSettings });
//     }

//     handleClickOutside = (event) => {
//         if (this.settingsButtonRef.current && !this.settingsButtonRef.current.contains(event.target)) {
//             this.setState({ showSettings: false });
//         }
//     }

//     addToHistory = (chat) => {
//         this.setState((prevState) => ({
//             chatHistory: [...prevState.chatHistory, chat],
//             currentChat: chat,
//         }));
//     };

//     selectChat = (chat) => {
//         this.setState({ currentChat: chat });
//     };

//     fetchModels = async () => {
//         try {
//             const response = await fetch("/api/models");
//             const data = await response.json();
//             this.setState({ models: data.models, selectedModel: data.models[0].name });
//         } catch (error) {
//             console.error("Error fetching models:", error);
//         }
//     };

//     handleModelChange = (event) => {
//         const selectedModel = event.target.value;
//         this.setState({ selectedModel });
//     };

//     handleUserInput = (event) => {
//         this.setState({ userInput: event.target.value });

//     };

//     handleNewChat = () => {
//         this.setState((prevState) => ({
//             chatThreads: [...prevState.chatThreads, { id: Date.now(), messages: [] }],
//             currentThreadIndex: prevState.chatThreads.length, // Index of the new thread
//         }));
//     };

//     selectChatThread = (index) => {
//         this.setState({ currentThreadIndex: index });
//     };
    
    

//     handleSendMessage = async () => {
//         const { selectedModel, userInput, chatContent } = this.state;
    
//         // Add user's message to the chat content
//         const updatedChatContent = [...chatContent, { role: "user", content: userInput }];
    
//         // Clear the user input field and update chat content with the user's message
//         this.setState({
//             chatContent: updatedChatContent,
//             userInput: "",
//         });
    
//         try {
//             const response = await fetch("/api/chat", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     model: selectedModel,
//                     messages: updatedChatContent,
//                 }),
//             });
    
//             const reader = response.body.getReader();
//             let assistantResponse = "";
//             let tempResponse = "";
    
//             // Create a new message object for the assistant's response
//             const assistantMessage = {
//                 role: "assistant",
//                 content: "",
//             };
    
//             // Add the assistant's message to the chat content
//             this.setState((prevState) => ({
//                 chatContent: [...prevState.chatContent, assistantMessage],
//             }));
    
//             // Read the stream
//             while (true) {
//                 const { done, value } = await reader.read();
//                 if (done) break;
    
//                 const chunk = new TextDecoder("utf-8").decode(value);
//                 tempResponse += chunk;
    
//                 // Parse complete responses from chunk
//                 let result = null;
//                 try {
//                     result = JSON.parse(tempResponse);
//                 } catch (e) {
//                     // The JSON is not yet complete
//                 }
    
//                 if (result) {
//                     assistantResponse += result.message.content;
//                     tempResponse = ""; // Clear the temporary response buffer
    
//                     // Update the assistant's message in the chat content
//                     this.setState((prevState) => {
//                         const updatedChatContent = [...prevState.chatContent];
//                         updatedChatContent[updatedChatContent.length - 1].content = assistantResponse;
//                         return { chatContent: updatedChatContent };
//                     });
//                 }
//             }
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };
    
    
//     componentDidMount() {
//         document.addEventListener("mousedown", this.handleClickOutside);
//         this.fetchModels();
//     }

//     componentWillUnmount() {
//         document.removeEventListener("mousedown", this.handleClickOutside);
//     }

//     render() {
//         const { chatHistory, currentChat, models, selectedModel, userInput, chatContent } = this.state;

//         return (
//             <div className="flex h-screen">
//                 <div className="w-64 bg-gray-800 p-6 overflow-y-auto flex-none">
//                     {/* User profile and ChatGPT version */}
//                     <div>
//                         <div className="flex items-center space-x-4 p-2 mb-5">
//                             <img
//                                 className="h-12 w-12 rounded-full object-cover"
//                                 src="https://placehold.co/48x48"
//                                 alt="User profile image"
//                             />
//                             <div>
//                                 <h4 className="font-semibold text-lg text-white leading-tight truncate">ChatGPT</h4>
//                                 <div className="text-sm text-gray-400">ChatGPT 4</div>
//                             </div>
//                         </div>
//                         {/* Chat threads list */}
//                         <ChatHistory
//                             chatHistory={chatHistory}
//                             currentChat={currentChat}
//                             selectChat={this.selectChat}
//                         />
//                     </div>
//                     {/* Settings option */}
//                     <div ref={this.settingsButtonRef}>
//                         <button onClick={this.toggleSettings} className="flex items-center space-x-3 text-white p-2 rounded-md font-medium hover:bg-gray-700 w-full">
//                             <span className="text-gray-400">
//                                 <i className="fas fa-cog"></i>
//                             </span>
//                             <span>Settings</span>
//                         </button>
//                         {/* Settings Popup */}
//                         {this.state.showSettings && <SettingsPopup onClose={this.toggleSettings} />}
//                     </div>
//                 </div>
//                 <div className="flex-1 flex flex-col">
//                     {/* Chat header */}
//                     <div className="px-10 mt-6">
//                         <h1 className="text-4xl font-semibold text-center">
//                             {currentChat ? `Chat ${chatHistory.indexOf(currentChat) + 1}` : "Select a chat"}
//                         </h1>
//                         <ModelSelector
//                             models={models}
//                             selectedModel={selectedModel}
//                             handleModelChange={this.handleModelChange}
//                         />
//                     </div>
                    
//                     {/* Chat content */}
//                     <div className="flex-1 px-10 mt-10 overflow-y-auto">
//                         {chatContent.map((message, index) => (
//                             <div
//                                 key={index}
//                                 className={`mb-4 ${
//                                     message.role === "user" ? "text-right" : "text-left"
//                                 }`}
//                             >
//                                 <span
//                                     className={`inline-block px-4 py-2 rounded-lg ${
//                                         message.role === "user"
//                                             ? "bg-blue-500 text-white"
//                                             : "bg-gray-800 text-white"
//                                     }`}
//                                 >
//                                     {message.content}
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                     {/* Chat input area */}
//                     <ChatInput
//                         userInput={userInput}
//                         handleUserInput={this.handleUserInput}
//                         handleSendMessage={this.handleSendMessage}
//                     />
//                 </div>
//             </div>
//         );
//     }
// }

// ReactDOM.render(<App />, document.getElementById("app"));

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettings: false,
            chatThreads: [],
            currentThreadIndex: -1,
            models: [],
            selectedModel: null,
            userInput: "",
        };
        this.settingsButtonRef = React.createRef();
        this.chatContainerRef = React.createRef();
    }
 
    toggleSettings = () => {
        this.setState({ showSettings: !this.state.showSettings });
    }
 
    handleClickOutside = (event) => {
        if (this.settingsButtonRef.current && !this.settingsButtonRef.current.contains(event.target)) {
            this.setState({ showSettings: false });
        }
    }
 
    fetchModels = async () => {
        try {
            const response = await fetch("/api/models");
            const data = await response.json();
            this.setState({ models: data.models, selectedModel: data.models[0].name });
        } catch (error) {
            console.error("Error fetching models:", error);
        }
    };
 
    handleModelChange = (event) => {
        const selectedModel = event.target.value;
        this.setState({ selectedModel });
    };
 
    handleUserInput = (event) => {
        this.setState({ userInput: event.target.value });
    };
 
    handleNewChat = () => {
        const newThreadId = Date.now();
        const newThread = { id: newThreadId, messages: [], name: `Chat ${this.state.chatThreads.length + 1}` };
        this.setState((prevState) => ({
            chatThreads: [...prevState.chatThreads, newThread],
            currentThreadIndex: prevState.chatThreads.length,
            userInput: "",
        }));
    };
 
    selectChatThread = (index) => {
        this.setState({ currentThreadIndex: index });
    };
 
    handleChatNameChange = (event, index) => {
        const newName = event.target.value;
        this.setState((prevState) => ({
            chatThreads: prevState.chatThreads.map((thread, i) =>
                i === index ? { ...thread, name: newName } : thread
            ),
        }));
    };
 
    handleDeleteChat = (index) => {
        this.setState((prevState) => ({
            chatThreads: prevState.chatThreads.filter((_, i) => i !== index),
            currentThreadIndex: prevState.currentThreadIndex === index ? -1 : prevState.currentThreadIndex,
        }));
    };
 
    handleSendMessage = async () => {
        const { selectedModel, userInput, chatThreads, currentThreadIndex } = this.state;
        const currentThread = chatThreads[currentThreadIndex];
 
        if (!currentThread) return;
 
        const updatedMessages = [...currentThread.messages, { role: "user", content: userInput }];
 
        this.setState((prevState) => ({
            chatThreads: prevState.chatThreads.map((thread, index) =>
                index === currentThreadIndex ? { ...thread, messages: updatedMessages } : thread
            ),
            userInput: "",
        }));
 
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: updatedMessages,
                }),
            });
 
            const reader = response.body.getReader();
            let assistantResponse = "";
            let tempResponse = "";
 
            const assistantMessage = {
                role: "assistant",
                content: "",
            };
 
            this.setState((prevState) => ({
                chatThreads: prevState.chatThreads.map((thread, index) =>
                    index === currentThreadIndex
                        ? { ...thread, messages: [...thread.messages, assistantMessage] }
                        : thread
                ),
            }));
 
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
 
                const chunk = new TextDecoder("utf-8").decode(value);
                tempResponse += chunk;
 
                let result = null;
                try {
                    result = JSON.parse(tempResponse);
                } catch (e) {
                    // JSON not yet complete, continue reading
                }
 
                if (result) {
                    assistantResponse += result.message.content;
                    tempResponse = "";
 
                    this.setState((prevState) => ({
                        chatThreads: prevState.chatThreads.map((thread, index) =>
                            index === currentThreadIndex
                                ? {
                                    ...thread,
                                    messages: thread.messages.map((message, messageIndex) =>
                                        messageIndex === thread.messages.length - 1
                                            ? { ...message, content: assistantResponse }
                                            : message
                                    ),
                                }
                                : thread
                        ),
                    }));
 
                    // Autoscroll after new message
                    this.chatContainerRef.current.scrollTop = this.chatContainerRef.current.scrollHeight;
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
 
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        this.fetchModels();
    }
 
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }
 
    render() {
        const { chatThreads, currentThreadIndex, models, selectedModel, userInput } = this.state;
 
        return (
            <div className="flex h-screen">
                <div className="w-64 bg-gray-800 p-6 overflow-y-auto flex-none">
                    {/* User profile and ChatGPT version */}
                    <div>
                        <div className="flex items-center space-x-4 p-2 mb-5">
                            <img
                                className="h-12 w-12 rounded-full object-cover"
                                src="https://placehold.co/48x48"
                                alt="User profile image"
                            />
                            <div>
                                <h4 className="font-semibold text-lg text-white leading-tight truncate">ChatGPT</h4>
                                <div className="text-sm text-gray-400">ChatGPT 4</div>
                            </div>
                        </div>
                        {/* Chat threads list */}
                        <div>
                            <button
                                onClick={this.handleNewChat}
                                className="start-new-chat-button w-full text-white bg-blue-500 p-2 mb-2 rounded"
                            >
                                Start New Chat
                            </button>
                            {chatThreads.map((thread, index) => (
                                <div key={thread.id} className="mb-2 p-2 rounded bg-gray-700">
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="text"
                                            value={thread.name}
                                            onChange={(e) => this.handleChatNameChange(e, index)}
                                            className="bg-transparent text-white focus:outline-none"
                                        />
                                        <button
                                            onClick={() => this.handleDeleteChat(index)}
                                            className="text-red-500 hover:text-red-300"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <div
                                        onClick={() => this.selectChatThread(index)}
                                        className={`cursor-pointer mt-2 p-2 rounded ${
                                            currentThreadIndex === index ? "bg-gray-600" : "hover:bg-gray-600"
                                        }`}
                                    >
                                        View Chat
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Settings option */}
                    <div ref={this.settingsButtonRef}>
                        <button
                            onClick={this.toggleSettings}
                            className="flex items-center space-x-3 text-white p-2 rounded-md font-medium hover:bg-gray-700 w-full"
                        >
                            <span className="text-gray-400">
                                <i className="fas fa-cog"></i>
                            </span>
                            <span>Settings</span>
                        </button>
                        {/* Settings Popup */}
                        {this.state.showSettings && <SettingsPopup onClose={this.toggleSettings} />}
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    {/* Chat header */}
                    <div className="px-10 mt-6">
                        <ModelSelector
                            models={models}
                            selectedModel={selectedModel}
                            handleModelChange={this.handleModelChange}
                        />
                    </div>
 
                    {/* Chat content */}
                    <div className="flex-1 px-10 mt-10 overflow-y-auto" ref={this.chatContainerRef}>
                        {currentThreadIndex !== -1 && (
                            <>
                                {chatThreads[currentThreadIndex].messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 ${
                                            message.role === "user" ? "text-right" : "text-left"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block px-4 py-2 rounded-lg ${
                                                message.role === "user"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-800 text-white"
                                            }`}
                                        >
                                            {message.content}
                                        </span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    {/* Chat input area */}
                    <ChatInput
                        userInput={userInput}
                        handleUserInput={this.handleUserInput}
                        handleSendMessage={this.handleSendMessage}
                    />
                </div>
            </div>
        );
    }
 }
 
 ReactDOM.render(<App />, document.getElementById("app"));