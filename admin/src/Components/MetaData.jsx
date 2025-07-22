import React, { useState } from 'react';
import { Plus, X, Clock, User, BookOpen, Send, Copy, Check, Upload, FileText } from 'lucide-react';
import ServerConfig from "../Constants/Config.js";

function MetaData() {
    // State for time configuration
    const [timeConfig, setTimeConfig] = useState({
        start: 8,
        end: 15,
        duration: 50,
        relax_period: 10
    });

    // State for teachers
    const [teachers, setTeachers] = useState([]);
    const [newTeacher, setNewTeacher] = useState({ abbreviation: '', name: '' });

    // State for subjects
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState({ name: '', code: '', tag: 'CS' });

    // Available tags
    const availableTags = ['CS', 'EC', 'HS', 'PH', 'MA', 'OTH'];

    // Copy state
    const [copySuccess, setCopySuccess] = useState(false);

    // Load JSON states
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [loadError, setLoadError] = useState('');

    // Add teacher
    const addTeacher = () => {
        if (newTeacher.abbreviation.trim() && newTeacher.name.trim()) {
            setTeachers([...teachers, { ...newTeacher }]);
            setNewTeacher({ abbreviation: '', name: '' });
        }
    };

    // Remove teacher
    const removeTeacher = (index) => {
        setTeachers(teachers.filter((_, i) => i !== index));
    };

    // Add subject
    const addSubject = () => {
        if (newSubject.name.trim() && newSubject.code.trim()) {
            setSubjects([...subjects, { ...newSubject }]);
            setNewSubject({ name: '', code: '', tag: 'CS' });
        }
    };

    // Remove subject
    const removeSubject = (index) => {
        setSubjects(subjects.filter((_, i) => i !== index));
    };

    // Copy JSON to clipboard
    const copyToClipboard = async () => {
        const payload = {
            time: timeConfig,
            teachers: teachers,
            subjects: subjects
        };

        try {
            await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = JSON.stringify(payload, null, 2);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    // Load JSON from input
    const loadFromJson = () => {
        setLoadError('');
        try {
            const data = JSON.parse(jsonInput);

            // Validate structure
            if (!data.time || !data.teachers || !data.subjects) {
                throw new Error('Invalid JSON structure. Must contain time, teachers, and subjects.');
            }

            // Validate time object
            if (typeof data.time.start !== 'number' || typeof data.time.end !== 'number' ||
                typeof data.time.duration !== 'number' || typeof data.time.relax_period !== 'number') {
                throw new Error('Invalid time configuration. All time values must be numbers.');
            }

            // Validate teachers array
            if (!Array.isArray(data.teachers)) {
                throw new Error('Teachers must be an array.');
            }

            for (let teacher of data.teachers) {
                if (!teacher.abbreviation || !teacher.name) {
                    throw new Error('Each teacher must have abbreviation and name.');
                }
            }

            // Validate subjects array
            if (!Array.isArray(data.subjects)) {
                throw new Error('Subjects must be an array.');
            }

            for (let subject of data.subjects) {
                if (!subject.name || !subject.code || !subject.tag) {
                    throw new Error('Each subject must have name, code, and tag.');
                }
                if (!availableTags.includes(subject.tag)) {
                    throw new Error(`Invalid tag: ${subject.tag}. Must be one of: ${availableTags.join(', ')}`);
                }
            }

            // If all validations pass, load the data
            setTimeConfig(data.time);
            setTeachers(data.teachers);
            setSubjects(data.subjects);
            setShowLoadModal(false);
            setJsonInput('');

        } catch (error) {
            setLoadError(error.message);
        }
    };

    // Clear load modal
    const clearLoadModal = () => {
        setShowLoadModal(false);
        setJsonInput('');
        setLoadError('');
    };

    // Submit data to server
    const handleSubmit = async () => {
        const payload = {
            time: timeConfig,
            teachers: teachers,
            subjects: subjects
        };

        try {
            let URL = ServerConfig.BaseURL + '/metadata'
            const response = await fetch('http://localhost:3000/metadata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Data submitted successfully!');
            } else {
                console.error(response);
                alert('Failed to submit data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting data');
        }
    };

    return (
        <div className="h-full">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">MetaData Configuration</h1>
                <p className="text-gray-600">Configure teachers, time slots, and subjects for your timetable</p>

                {/* Load JSON Button */}
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

            {/* Three Equal Vertical Columns */}
            <div className="grid grid-cols-3 gap-6 h-[600px]">

                {/* Teachers Column (Left) */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 flex flex-col">
                    <div className="flex items-center mb-6">
                        <User className="w-6 h-6 text-green-600 mr-2" />
                        <h2 className="text-xl font-semibold text-green-800">Teachers</h2>
                    </div>

                    {/* Add Teacher Form */}
                    <div className="space-y-3 mb-6">
                        <input
                            type="text"
                            placeholder="Abbreviation (e.g., PKS)"
                            value={newTeacher.abbreviation}
                            onChange={(e) => setNewTeacher({...newTeacher, abbreviation: e.target.value})}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={newTeacher.name}
                            onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                            onClick={addTeacher}
                            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Teacher
                        </button>
                    </div>

                    {/* Teachers List - Below Add Button */}
                    <div className="flex-1 overflow-hidden">
                        <h3 className="text-sm font-medium text-green-700 mb-3">Added Teachers ({teachers.length})</h3>
                        <div className="space-y-2 overflow-y-auto h-full">
                            {teachers.map((teacher, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-green-800 truncate">{teacher.abbreviation}</div>
                                        <div className="text-sm text-green-600 truncate">{teacher.name}</div>
                                    </div>
                                    <button
                                        onClick={() => removeTeacher(index)}
                                        className="text-red-500 hover:text-red-700 transition-colors ml-2 flex-shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {teachers.length === 0 && (
                                <div className="text-green-600 text-center py-8 text-sm">No teachers added yet</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Time Configuration Column (Middle) */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 flex flex-col">
                    <div className="flex items-center mb-6">
                        <Clock className="w-6 h-6 text-blue-600 mr-2" />
                        <h2 className="text-xl font-semibold text-blue-800">Time Configuration</h2>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-2">Start Hour</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={timeConfig.start}
                                    onChange={(e) => setTimeConfig({...timeConfig, start: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-2">End Hour</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={timeConfig.end}
                                    onChange={(e) => setTimeConfig({...timeConfig, end: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-2">Duration (mins)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={timeConfig.duration}
                                    onChange={(e) => setTimeConfig({...timeConfig, duration: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-2">Break (mins)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={timeConfig.relax_period}
                                    onChange={(e) => setTimeConfig({...timeConfig, relax_period: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Time Configuration Summary - Below Form */}
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-blue-700 mb-3">Current Configuration</h3>
                        <div className="space-y-3">
                            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-blue-600">Working Hours:</span>
                                        <div className="font-medium text-blue-800">{timeConfig.start}:00 - {timeConfig.end}:00</div>
                                    </div>
                                    <div>
                                        <span className="text-blue-600">Class Duration:</span>
                                        <div className="font-medium text-blue-800">{timeConfig.duration} minutes</div>
                                    </div>
                                    <div>
                                        <span className="text-blue-600">Break Time:</span>
                                        <div className="font-medium text-blue-800">{timeConfig.relax_period} minutes</div>
                                    </div>
                                    <div>
                                        <span className="text-blue-600">Total Slots:</span>
                                        <div className="font-medium text-blue-800">
                                            {Math.floor((timeConfig.end - timeConfig.start) * 60 / (timeConfig.duration + timeConfig.relax_period))} slots
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-200 p-3 rounded-lg">
                                <div className="text-xs text-blue-800">
                                    <strong>JSON Preview:</strong>
                                </div>
                                <pre className="text-xs text-blue-700 mt-1 overflow-x-auto">
{JSON.stringify(timeConfig, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subjects Column (Right) */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 flex flex-col">
                    <div className="flex items-center mb-6">
                        <BookOpen className="w-6 h-6 text-purple-600 mr-2" />
                        <h2 className="text-xl font-semibold text-purple-800">Subjects</h2>
                    </div>

                    {/* Add Subject Form */}
                    <div className="space-y-3 mb-6">
                        <input
                            type="text"
                            placeholder="Subject Name"
                            value={newSubject.name}
                            onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                            type="text"
                            placeholder="Subject Code"
                            value={newSubject.code}
                            onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />

                        {/* Tag Selection */}
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-2">Department</label>
                            <div className="grid grid-cols-3 gap-1">
                                {availableTags.map((tag) => (
                                    <label key={tag} className="flex items-center space-x-1 cursor-pointer text-xs">
                                        <input
                                            type="radio"
                                            name="subjectTag"
                                            value={tag}
                                            checked={newSubject.tag === tag}
                                            onChange={(e) => setNewSubject({...newSubject, tag: e.target.value})}
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="text-purple-700">{tag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={addSubject}
                            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Subject
                        </button>
                    </div>

                    {/* Subjects List - Below Add Button */}
                    <div className="flex-1 overflow-hidden">
                        <h3 className="text-sm font-medium text-purple-700 mb-3">Added Subjects ({subjects.length})</h3>
                        <div className="space-y-2 overflow-y-auto h-full">
                            {subjects.map((subject, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-purple-800 truncate">{subject.name}</div>
                                        <div className="text-sm text-purple-600 truncate">{subject.code}</div>
                                        <div className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded mt-1 inline-block">
                                            {subject.tag}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeSubject(index)}
                                        className="text-red-500 hover:text-red-700 transition-colors ml-2 flex-shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {subjects.length === 0 && (
                                <div className="text-purple-600 text-center py-8 text-sm">No subjects added yet</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center items-center gap-4 pt-6">
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
                    onClick={handleSubmit}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-lg"
                >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Configuration
                </button>
            </div>

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
                                onClick={clearLoadModal}
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
                                          "time": {
                                            "start": 8,
                                            "end": 15,
                                            "duration": 50,
                                            "relax_period": 10
                                          },
                                          "teachers": [
                                            {
                                              "abbreviation": "PKS",
                                              "name": "Pankaj Kumar Srinivasa"
                                            }
                                          ],
                                          "subjects": [
                                            {
                                              "name": "Materials Science",
                                              "code": "16B1NPH532",
                                              "tag": "PH"
                                            }
                                          ]
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
                                    onClick={clearLoadModal}
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
        </div>
    );
}

export default MetaData;