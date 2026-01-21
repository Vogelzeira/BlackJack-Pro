
import React, { useState } from 'react';
import { Settings, CountingSystemName } from '../types';
import { COUNTING_SYSTEMS } from '../constants';

interface SettingsModalProps {
    currentSettings: Settings;
    onSave: (settings: Settings) => void;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ currentSettings, onSave, onClose }) => {
    const [settings, setSettings] = useState<Settings>(currentSettings);

    const handleSave = () => {
        onSave(settings);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-emerald-400">Game Settings</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700">&times;</button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Number of Decks</label>
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 4, 6, 8].map(num => (
                                <button key={num} onClick={() => setSettings(s => ({ ...s, numberOfDecks: num as Settings['numberOfDecks'] }))}
                                    className={`py-2 rounded transition-colors ${settings.numberOfDecks === num ? 'bg-emerald-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Counting System</label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.keys(COUNTING_SYSTEMS).map(name => (
                                <button key={name} onClick={() => setSettings(s => ({ ...s, countingSystem: name as CountingSystemName }))}
                                    className={`py-2 rounded transition-colors ${settings.countingSystem === name ? 'bg-emerald-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                    <button onClick={onClose} className="py-2 px-4 rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors">Cancel</button>
                    <button onClick={handleSave} className="py-2 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors">Save & Restart</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
