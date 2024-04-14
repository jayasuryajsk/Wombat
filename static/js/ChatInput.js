function ChatInput({ userInput, handleUserInput, handleSendMessage }) {
    return (
        <div className="p-4 bg-gray-800 flex">
            <input
                type="text"
                value={userInput}
                onChange={handleUserInput}
                onKeyPress={(event) => {
                    if (event.key === "Enter") {
                        handleSendMessage();
                    }
                }}
                placeholder="Message ..."
                className="flex-1 bg-gray-900 text-white p-2 rounded-l-md border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <button
                onClick={handleSendMessage}
                className="bg-gray-900 text-gray-400 hover:text-gray-300 p-2 rounded-r-md border border-gray-700 focus:outline-none"
            >
                <i className="fas fa-paper-plane"></i>
            </button>
        </div>
    );
}