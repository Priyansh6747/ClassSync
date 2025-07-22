import React from 'react';
import { X, Upload, FileText } from 'lucide-react';

export function Modals({
                           // Modal states
                           showDayModal,
                           showColumnModal,
                           showSlotModal,
                           showLoadModal,

                           // Form data
                           newDay,
                           newColumn,
                           newSlot,
                           jsonInput,
                           loadError,
                           editingSlotIndex,

                           // Available options
                           dayNames,
                           slotPurposes,
                           availableBatches,
                           days,

                           // Setters
                           setNewDay,
                           setNewColumn,
                           setNewSlot,
                           setJsonInput,
                           setLoadError,

                           // Modal controls
                           setShowDayModal,
                           setShowColumnModal,
                           setShowSlotModal,
                           setShowLoadModal,

                           // Actions
                           addDay,
                           addColumn,
                           saveSlot,
                           resetSlotModal,
                           loadFromJson
                       }) {
    return (
        <>
            {/* Add Day Modal */}
            {showDayModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Add New Day</h3>
                            <button onClick={() => setShowDayModal(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Day</label>
                                <select
                                    value={newDay.day}
                                    onChange={(e) => setNewDay({...newDay, day: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {dayNames.map((name, index) => (
                                        <option key={index} value={index} disabled={days.some(d => d.day === index)}>
                                            {name} {days.some(d => d.day === index) ? '(Already added)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={addDay}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Day
                                </button>
                                <button
                                    onClick={() => setShowDayModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Column Modal */}
            {showColumnModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">Add Time Slot</h3>
                            <button onClick={() => setShowColumnModal(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Hour</label>
                                    <input
                                        type="number"
                                        min="0" max="23"
                                        value={newColumn.start_time.hr}
                                        onChange={(e) => setNewColumn({
                                            ...newColumn,
                                            start_time: {...newColumn.start_time, hr: parseInt(e.target.value)}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
                                    <input
                                        type="number"
                                        min="0" max="59"
                                        value={newColumn.start_time.min}
                                        onChange={(e) => setNewColumn({
                                            ...newColumn,
                                            start_time: {...newColumn.start_time, min: parseInt(e.target.value)}
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={newColumn.duration}
                                    onChange={(e) => setNewColumn({...newColumn, duration: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={addColumn}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Add Time Slot
                                </button>
                                <button
                                    onClick={() => setShowColumnModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Slot Modal */}
            {showSlotModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold">
                                {editingSlotIndex !== null ? 'Edit Schedule' : 'Add Schedule'}
                            </h3>
                            <button onClick={resetSlotModal}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Slot Purpose</label>
                                    <select
                                        value={newSlot.slot_purpose}
                                        onChange={(e) => setNewSlot({...newSlot, slot_purpose: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        {slotPurposes.map(purpose => (
                                            <option key={purpose} value={purpose}>
                                                {purpose === 'L' ? 'Lecture' : purpose === 'T' ? 'Tutorial' : 'Practical'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
                                    <input
                                        type="text"
                                        value={newSlot.room}
                                        onChange={(e) => setNewSlot({...newSlot, room: e.target.value})}
                                        placeholder="e.g., Room 101"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                                <input
                                    type="text"
                                    value={newSlot.course}
                                    onChange={(e) => setNewSlot({...newSlot, course: e.target.value})}
                                    placeholder="Course name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Batches</label>
                                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                                    {availableBatches.map(batch => (
                                        <label key={batch} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newSlot.batch.includes(batch)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewSlot({...newSlot, batch: [...newSlot.batch, batch]});
                                                    } else {
                                                        setNewSlot({...newSlot, batch: newSlot.batch.filter(b => b !== batch)});
                                                    }
                                                }}
                                                className="text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm">{batch}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teachers</label>
                                <input
                                    type="text"
                                    value={newSlot.teacher.join(', ')}
                                    onChange={(e) => setNewSlot({
                                        ...newSlot,
                                        teacher: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                                    })}
                                    placeholder="Teacher names (comma separated)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={saveSlot}
                                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    {editingSlotIndex !== null ? 'Update Schedule' : 'Add Schedule'}
                                </button>
                                <button
                                    onClick={resetSlotModal}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Load JSON Modal */}
            {showLoadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <FileText className="w-6 h-6 mr-2 text-emerald-600" />
                                Load Configuration from JSON
                            </h2>
                            <button
                                onClick={() => setShowLoadModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Paste your JSON configuration below:
                                </label>
                                <textarea
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder={`Paste JSON here, example:
{
  "key": "admin123",
  "timetable": {
    "id": 1,
    "days": [
      {
        "day": 0,
        "cols": [
          {
            "start_time": { "hr": 9, "min": 0 },
            "duration": 50,
            "schedules": [
              {
                "slot_purpose": "L",
                "batch": ["F1", "F2"],
                "course": "Mathematics",
                "room": "Room 101",
                "teacher": ["Dr. Smith"]
              }
            ]
          }
        ]
      }
    ]
  }
}`}
                                    className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                                />
                            </div>

                            {loadError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-700 text-sm">{loadError}</p>
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    onClick={loadFromJson}
                                    disabled={!jsonInput.trim()}
                                    className="flex items-center px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Load Configuration
                                </button>

                                <button
                                    onClick={() => setShowLoadModal(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-800 text-sm">
                                    <strong>Note:</strong> Loading will replace all current configuration.
                                    Make sure to copy your current settings if you want to keep them.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}