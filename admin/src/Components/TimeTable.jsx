import React, { useState } from 'react';
import { Plus, Calendar, Clock, Copy, Check, Upload, Send } from 'lucide-react';
import { Modals } from './Modals';
import { DayCard } from './DayCard';

function TimetableForm() {
    // State for admin key
    const [adminKey, setAdminKey] = useState('');

    // State for timetable
    const [timetableId, setTimetableId] = useState(1);
    const [days, setDays] = useState([]);

    // Available options
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const slotPurposes = ['L', 'T', 'P']; // Lecture, Tutorial, Practical
    const availableBatches = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'E15', 'E16', 'E17', 'All'];

    // Modal states
    const [showDayModal, setShowDayModal] = useState(false);
    const [showColumnModal, setShowColumnModal] = useState(false);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);

    // Form states for modals
    const [currentDayIndex, setCurrentDayIndex] = useState(null);
    const [currentColumnIndex, setCurrentColumnIndex] = useState(null);
    const [editingSlotIndex, setEditingSlotIndex] = useState(null);

    // New entities
    const [newDay, setNewDay] = useState({ day: 0, cols: [] });
    const [newColumn, setNewColumn] = useState({
        start_time: { hr: 9, min: 0 },
        duration: 50,
        schedules: []
    });
    const [newSlot, setNewSlot] = useState({
        slot_purpose: 'L',
        batch: [],
        course: '',
        room: '',
        teacher: []
    });

    // Copy and load states
    const [copySuccess, setCopySuccess] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [loadError, setLoadError] = useState('');

    // Drag and drop states
    const [draggedSlot, setDraggedSlot] = useState(null);
    const [draggedFrom, setDraggedFrom] = useState(null); // {dayIndex, colIndex, slotIndex}
    const [dragOverColumn, setDragOverColumn] = useState(null); // {dayIndex, colIndex}

    // Handle drag start - store the slot being dragged and its source location
    const handleDragStart = (dayIndex, colIndex, slotIndex) => {
        const day = days.find(d => d.day === dayIndex);
        const slot = day.cols[colIndex].schedules[slotIndex];

        setDraggedSlot({ ...slot });
        setDraggedFrom({ dayIndex, colIndex, slotIndex });
    };

    // Handle drag over - set visual feedback for valid drop zones
    const handleDragOver = (e, dayIndex, colIndex) => {
        e.preventDefault(); // Allow drop
        setDragOverColumn({ dayIndex, colIndex });
    };

    // Handle drag leave - clear visual feedback
    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    // Handle drop - move slot from source to target column
    const handleDrop = (e, dayIndex, colIndex) => {
        e.preventDefault();

        if (!draggedSlot || !draggedFrom) return;

        // Don't do anything if dropping in the same location
        if (draggedFrom.dayIndex === dayIndex &&
            draggedFrom.colIndex === colIndex) {
            setDraggedSlot(null);
            setDraggedFrom(null);
            setDragOverColumn(null);
            return;
        }

        const updatedDays = [...days];

        // Remove slot from source column
        const sourceDay = updatedDays.find(d => d.day === draggedFrom.dayIndex);
        sourceDay.cols[draggedFrom.colIndex].schedules.splice(draggedFrom.slotIndex, 1);

        // Add slot to target column
        const targetDay = updatedDays.find(d => d.day === dayIndex);
        targetDay.cols[colIndex].schedules.push(draggedSlot);

        setDays(updatedDays);

        // Clear drag states
        setDraggedSlot(null);
        setDraggedFrom(null);
        setDragOverColumn(null);
    };

    // Helper function to check if a column is being dragged over
    const isColumnDragTarget = (dayIndex, colIndex) => {
        return dragOverColumn &&
            dragOverColumn.dayIndex === dayIndex &&
            dragOverColumn.colIndex === colIndex;
    };

    // Helper function to check if a slot is being dragged
    const isSlotBeingDragged = (dayIndex, colIndex, slotIndex) => {
        return draggedFrom &&
            draggedFrom.dayIndex === dayIndex &&
            draggedFrom.colIndex === colIndex &&
            draggedFrom.slotIndex === slotIndex;
    };

    // Helper functions
    const formatTime = (timeStamp) => {
        return `${timeStamp.hr.toString().padStart(2, '0')}:${timeStamp.min.toString().padStart(2, '0')}`;
    };

    const getDayName = (dayIndex) => dayNames[dayIndex] || `Day ${dayIndex}`;

    // Add new day
    const addDay = () => {
        if (days.find(d => d.day === newDay.day)) {
            alert('Day already exists!');
            return;
        }
        setDays([...days, { ...newDay, cols: [] }]);
        setNewDay({ day: 0, cols: [] });
        setShowDayModal(false);
    };

    // Remove day
    const removeDay = (dayIndex) => {
        setDays(days.filter(d => d.day !== dayIndex));
    };

    // Add column to day
    const addColumn = () => {
        const updatedDays = [...days];
        const dayToUpdate = updatedDays.find(d => d.day === currentDayIndex);
        if (dayToUpdate) {
            dayToUpdate.cols.push({ ...newColumn, schedules: [] });
        }
        setDays(updatedDays);
        setNewColumn({
            start_time: { hr: 9, min: 0 },
            duration: 50,
            schedules: []
        });
        setShowColumnModal(false);
    };

    // Remove column
    const removeColumn = (dayIndex, colIndex) => {
        const updatedDays = [...days];
        const dayToUpdate = updatedDays.find(d => d.day === dayIndex);
        if (dayToUpdate) {
            dayToUpdate.cols.splice(colIndex, 1);
        }
        setDays(updatedDays);
    };

    // Add or edit slot
    const saveSlot = () => {
        const updatedDays = [...days];
        const dayToUpdate = updatedDays.find(d => d.day === currentDayIndex);
        const columnToUpdate = dayToUpdate.cols[currentColumnIndex];

        const slotData = {
            slot_purpose: newSlot.slot_purpose || undefined,
            batch: newSlot.batch.length > 0 ? newSlot.batch : undefined,
            course: newSlot.course.trim() || undefined,
            room: newSlot.room.trim() || undefined,
            teacher: newSlot.teacher.length > 0 ? newSlot.teacher : undefined
        };

        // Remove undefined values
        Object.keys(slotData).forEach(key => slotData[key] === undefined && delete slotData[key]);

        if (editingSlotIndex !== null) {
            columnToUpdate.schedules[editingSlotIndex] = slotData;
        } else {
            columnToUpdate.schedules.push(slotData);
        }

        setDays(updatedDays);
        resetSlotModal();
    };

    // Reset slot modal
    const resetSlotModal = () => {
        setNewSlot({
            slot_purpose: 'L',
            batch: [],
            course: '',
            room: '',
            teacher: []
        });
        setEditingSlotIndex(null);
        setShowSlotModal(false);
    };

    // Open slot modal for editing
    const editSlot = (dayIndex, colIndex, slotIndex) => {
        const day = days.find(d => d.day === dayIndex);
        const slot = day.cols[colIndex].schedules[slotIndex];

        setNewSlot({
            slot_purpose: slot.slot_purpose || 'L',
            batch: slot.batch || [],
            course: slot.course || '',
            room: slot.room || '',
            teacher: slot.teacher || []
        });

        setCurrentDayIndex(dayIndex);
        setCurrentColumnIndex(colIndex);
        setEditingSlotIndex(slotIndex);
        setShowSlotModal(true);
    };

    // Remove slot
    const removeSlot = (dayIndex, colIndex, slotIndex) => {
        const updatedDays = [...days];
        const dayToUpdate = updatedDays.find(d => d.day === dayIndex);
        dayToUpdate.cols[colIndex].schedules.splice(slotIndex, 1);
        setDays(updatedDays);
    };

    // Generate final JSON
    const generateJSON = () => {
        return {
            key: adminKey,
            timetable: {
                id: timetableId,
                days: days.sort((a, b) => a.day - b.day)
            }
        };
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        const payload = generateJSON();
        try {
            await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // Load from JSON
    const loadFromJson = () => {
        setLoadError('');
        try {
            const data = JSON.parse(jsonInput);

            // Validate structure
            if (!data.key || !data.timetable) {
                throw new Error('Invalid JSON structure. Must contain key and timetable.');
            }

            if (!data.timetable.id || !Array.isArray(data.timetable.days)) {
                throw new Error('Invalid timetable structure.');
            }

            setAdminKey(data.key);
            setTimetableId(data.timetable.id);
            setDays(data.timetable.days);
            setShowLoadModal(false);
            setJsonInput('');
        } catch (error) {
            setLoadError(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Timetable Configuration</h1>
                <p className="text-gray-600">Configure your complete timetable with days, time slots, and schedules</p>

                <div className="mt-4">
                    <button
                        onClick={() => setShowLoadModal(true)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-md mx-auto"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Load from JSON
                    </button>
                </div>
            </div>

            {/* Admin Key and Timetable ID */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Configuration</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Key</label>
                            <input
                                type="password"
                                value={adminKey}
                                onChange={(e) => setAdminKey(e.target.value)}
                                placeholder="Enter admin key"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Timetable ID</label>
                            <input
                                type="number"
                                value={timetableId}
                                onChange={(e) => setTimetableId(parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Days Configuration */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-lg border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Days & Time Slots</h2>
                        <button
                            onClick={() => setShowDayModal(true)}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Day
                        </button>
                    </div>

                    {/* Days List */}
                    <div className="space-y-6">
                        {days.sort((a, b) => a.day - b.day).map((day) => (
                            <DayCard
                                key={day.day}
                                day={day}
                                getDayName={getDayName}
                                formatTime={formatTime}
                                onAddTimeSlot={(dayIndex) => {
                                    setCurrentDayIndex(dayIndex);
                                    setShowColumnModal(true);
                                }}
                                onRemoveDay={removeDay}
                                onRemoveColumn={removeColumn}
                                onAddSchedule={(dayIndex, colIndex) => {
                                    setCurrentDayIndex(dayIndex);
                                    setCurrentColumnIndex(colIndex);
                                    setShowSlotModal(true);
                                }}
                                onEditSlot={editSlot}
                                onRemoveSlot={removeSlot}
                                // ADD THE MISSING DRAG & DROP PROPS
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                isColumnDragTarget={isColumnDragTarget}
                                isSlotBeingDragged={isSlotBeingDragged}
                            />
                        ))}

                        {days.length === 0 && (
                            <div className="text-gray-400 text-center py-12">
                                No days configured yet. Click "Add Day" to get started.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={copyToClipboard}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
                >
                    {copySuccess ? (
                        <>
                            <Check className="w-5 h-5 mr-2" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-5 h-5 mr-2" />
                            Copy JSON
                        </>
                    )}
                </button>

                <button
                    onClick={() => {
                        console.log('Timetable JSON:', generateJSON());
                        alert('Timetable logged to console!');
                    }}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-lg"
                >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Timetable
                </button>
            </div>

            {/* All Modals */}
            <Modals
                // Modal states
                showDayModal={showDayModal}
                showColumnModal={showColumnModal}
                showSlotModal={showSlotModal}
                showLoadModal={showLoadModal}

                // Form data
                newDay={newDay}
                newColumn={newColumn}
                newSlot={newSlot}
                jsonInput={jsonInput}
                loadError={loadError}
                editingSlotIndex={editingSlotIndex}

                // Available options
                dayNames={dayNames}
                slotPurposes={slotPurposes}
                availableBatches={availableBatches}
                days={days}

                // Setters
                setNewDay={setNewDay}
                setNewColumn={setNewColumn}
                setNewSlot={setNewSlot}
                setJsonInput={setJsonInput}
                setLoadError={setLoadError}

                // Modal controls
                setShowDayModal={setShowDayModal}
                setShowColumnModal={setShowColumnModal}
                setShowSlotModal={setShowSlotModal}
                setShowLoadModal={setShowLoadModal}

                // Actions
                addDay={addDay}
                addColumn={addColumn}
                saveSlot={saveSlot}
                resetSlotModal={resetSlotModal}
                loadFromJson={loadFromJson}
            />
        </div>
    );
}

export default TimetableForm;