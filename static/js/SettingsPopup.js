function SettingsPopup({ onClose }) {
    return (
        <div className="absolute bottom-0 left-0 w-48 mb-16 py-2 bg-gray-800 rounded-md shadow-xl z-50">
            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Account Settings</a>
            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Support</a>
            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">License</a>
            <div className="border-t border-gray-700"></div>
            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Sign out</a>
        </div>
    );
}