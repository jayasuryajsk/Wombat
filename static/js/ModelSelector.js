function ModelSelector({ models, selectedModel, handleModelChange }) {
    return (
        <div className="mt-4">
            <select
                value={selectedModel}
                onChange={handleModelChange}
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
            >
                {models.map((model) => (
                    <option key={model.name} value={model.name}>
                        {model.name}
                    </option>
                ))}
            </select>
        </div>
    );
}