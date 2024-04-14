function ChatHistory({ chatHistory, currentChat, selectChat }) {
    return (
        <ul className="space-y-2 text-sm">
            {chatHistory.map((chat, index) => (
                <li key={index}>
                    <a
                        href="#"
                        className={`flex items-center space-x-3 text-white p-2 rounded-md font-medium hover:bg-gray-700 ${
                            currentChat === chat ? "bg-gray-700" : ""
                        }`}
                        onClick={() => selectChat(chat)}
                    >
                        <span className="text-gray-400">
                            <i className="fas fa-comment-alt"></i>
                        </span>
                        <span>Chat {index + 1}</span>
                    </a>
                </li>
            ))}
        </ul>
    );
}