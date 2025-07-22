import React, { useState } from 'react';
import MetaData from "./Components/MetaData.jsx";
import TimeTable from "./Components/TimeTable.jsx";

function App() {
    const [showMetaData, setShowMetaData] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header Navigation */}
            <header className="w-full h-20 mb-6 px-4 flex items-center justify-center bg-white shadow-lg border-b border-slate-200">
                <div className="flex space-x-4 max-w-md w-full">
                    {/* MetaData Tab */}
                    <button
                        className={`flex-1 h-14 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md ${
                            showMetaData
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-purple-200'
                                : 'bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300'
                        }`}
                        onClick={() => setShowMetaData(true)}
                    >
                        <span className="flex items-center justify-center h-full">
                            MetaData
                        </span>
                    </button>

                    {/* TimeTable Tab */}
                    <button
                        className={`flex-1 h-14 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md ${
                            !showMetaData
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200'
                                : 'bg-white text-blue-500 border-2 border-blue-200 hover:border-blue-300'
                        }`}
                        onClick={() => setShowMetaData(false)}
                    >
                        <span className="flex items-center justify-center h-full">
                            TimeTable
                        </span>
                    </button>
                </div>
            </header>
            {showMetaData ? <MetaData /> : <TimeTable />}
        </div>
    );
}

export default App;