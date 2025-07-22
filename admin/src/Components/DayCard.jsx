import React from 'react';
import { Plus, X, Clock, Calendar, Trash2, Edit3 } from 'lucide-react';

export function DayCard({
                            day,
                            getDayName,
                            formatTime,
                            onAddTimeSlot,
                            onRemoveDay,
                            onRemoveColumn,
                            onAddSchedule,
                            onEditSlot,
                            onRemoveSlot,
                            // Drag & drop props
                            onDragStart,
                            onDragOver,
                            onDragLeave,
                            onDrop,
                            isColumnDragTarget,
                            isSlotBeingDragged
                        }) {
    return (
        <div className="border rounded-xl p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800">
                        {getDayName(day.day)}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onAddTimeSlot(day.day)}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Time Slot
                    </button>
                    <button
                        onClick={() => onRemoveDay(day.day)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Time Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {day.cols.map((col, colIndex) => (
                    <TimeSlotCard
                        key={colIndex}
                        col={col}
                        colIndex={colIndex}
                        dayIndex={day.day}
                        formatTime={formatTime}
                        onRemoveColumn={onRemoveColumn}
                        onAddSchedule={onAddSchedule}
                        onEditSlot={onEditSlot}
                        onRemoveSlot={onRemoveSlot}
                        // Pass drag & drop props to TimeSlotCard
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        isColumnDragTarget={isColumnDragTarget}
                        isSlotBeingDragged={isSlotBeingDragged}
                    />
                ))}
            </div>

            {day.cols.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                    No time slots configured for this day
                </div>
            )}
        </div>
    );
}

function TimeSlotCard({
                          col,
                          colIndex,
                          dayIndex,
                          formatTime,
                          onRemoveColumn,
                          onAddSchedule,
                          onEditSlot,
                          onRemoveSlot,
                          // Drag & drop props
                          onDragStart,
                          onDragOver,
                          onDragLeave,
                          onDrop,
                          isColumnDragTarget,
                          isSlotBeingDragged
                      }) {
    return (
        <div
            className={`border rounded-lg p-4 bg-white border-2 border-dashed ${
                isColumnDragTarget && isColumnDragTarget(dayIndex, colIndex)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
            }`}
            onDragOver={(e) => onDragOver && onDragOver(e, dayIndex, colIndex)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop && onDrop(e, dayIndex, colIndex)}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <Clock className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium">
                        {formatTime(col.start_time)} ({col.duration}min)
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onAddSchedule(dayIndex, colIndex)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => onRemoveColumn(dayIndex, colIndex)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Schedules */}
            <div className="space-y-2">
                {col.schedules.map((schedule, scheduleIndex) => (
                    <ScheduleItem
                        key={scheduleIndex}
                        schedule={schedule}
                        scheduleIndex={scheduleIndex}
                        dayIndex={dayIndex}
                        colIndex={colIndex}
                        onEditSlot={onEditSlot}
                        onRemoveSlot={onRemoveSlot}
                        // Pass drag & drop props to ScheduleItem
                        onDragStart={onDragStart}
                        isSlotBeingDragged={isSlotBeingDragged}
                    />
                ))}

                {/* Add Schedule Button */}
                <button
                    onClick={() => onAddSchedule(dayIndex, colIndex)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all text-sm"
                >
                    + Add Schedule
                </button>

                {col.schedules.length === 0 && (
                    <div className="text-gray-400 text-center text-xs py-2">
                        No schedules
                    </div>
                )}
            </div>
        </div>
    );
}

function ScheduleItem({
                          schedule,
                          scheduleIndex,
                          dayIndex,
                          colIndex,
                          onEditSlot,
                          onRemoveSlot,
                          // Drag & drop props
                          onDragStart,
                          isSlotBeingDragged
                      }) {
    return (
        <div
            draggable
            onDragStart={() => onDragStart && onDragStart(dayIndex, colIndex, scheduleIndex)}
            className={`bg-white p-3 rounded-lg border shadow-sm cursor-move hover:shadow-md transition-all ${
                isSlotBeingDragged && isSlotBeingDragged(dayIndex, colIndex, scheduleIndex)
                    ? 'opacity-50 border-blue-400'
                    : 'border-gray-200'
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {schedule.slot_purpose || 'L'}
                        </span>
                        {schedule.batch && (
                            <span className="text-xs text-gray-600">
                                {Array.isArray(schedule.batch)
                                    ? schedule.batch.join(', ')
                                    : schedule.batch}
                            </span>
                        )}
                    </div>
                    {schedule.course && (
                        <div className="font-medium text-sm text-gray-800 mb-1">
                            {schedule.course}
                        </div>
                    )}
                    <div className="text-xs text-gray-600 space-y-1">
                        {schedule.room && <div>Room: {schedule.room}</div>}
                        {schedule.teacher && (
                            <div>
                                Teacher: {Array.isArray(schedule.teacher)
                                ? schedule.teacher.join(', ')
                                : schedule.teacher}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => onEditSlot(dayIndex, colIndex, scheduleIndex)}
                        className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onRemoveSlot(dayIndex, colIndex, scheduleIndex)}
                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}