
async function formatTimetable(url, user) {
    try {
        const yearData = await getYearData(url, user.year);

        if (!yearData || !yearData.timetable || !yearData.subjects) {
            throw new Error("Invalid data structure received");
        }

        const { timetable, subjects } = yearData;
        const formattedTimetable = {};

        for (const [day, daySchedule] of Object.entries(timetable)) {
            formattedTimetable[day] = {};
            for (const [timeSlot, slots] of Object.entries(daySchedule)) {
                const userSlots = [];
                for (const slot of slots) {
                    if (typeof slot === 'string' && slot.trim()) {
                        if (shouldUserAttend(slot, user)) {
                            const parsedSlot = parseSlot(slot, subjects);
                            userSlots.push(parsedSlot);
                        }
                    }
                }
                if (userSlots.length > 0) {
                    formattedTimetable[day][timeSlot] = userSlots;
                }
            }
        }

        return formattedTimetable;

    } catch (error) {
        console.error('Error formatting timetable:', error);
        throw error;
    }
}

async function getYearData(url, year) {
    try {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        let data = await res.json();

        let yearData = [];
        switch (year) {
            case "1st":
            case "1":
                yearData = data["1"];
                break;
            case "2nd":
            case "2":
                yearData = data["2"];
                break;
            case "3rd":
            case "3":
                yearData = data["3"];
                break;
            case "4th":
            case "4":
                yearData = data["4"];
                break;
            default:
                console.warn(`Unknown year: ${year}`);
                yearData = [];
        }
        return yearData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}



async function getSubjects(url, year) {
    try {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        let data = await res.json();

        let sub = [];
        switch (year) {
            case "1st":
            case "1":
                sub = data["1"]?.subjects || [];
                break;
            case "2nd":
            case "2":
                sub = data["2"]?.subjects || [];
                break;
            case "3rd":
            case "3":
                sub = data["3"]?.subjects || [];
                break;
            case "4th":
            case "4":
                sub = data["4"]?.subjects || [];
                break;
            default:
                console.warn(`Unknown year: ${year}`);
                sub = [];
        }
        return sub;
    } catch (error) {
        console.error('Error fetching subjects:', error);
        throw error;
    }
}

function isBatchIncluded(batch, slot) {
    return slot.patterns.some(pattern =>
        pattern.includes(batch) || pattern.includes("ALL")
    );
}

function isSubjectIncluded(subjects, slot) {
    return subjects.some(subject =>
        slot.patterns.some(pattern =>
            pattern.includes(subject)
        )
    );
}


function UserSlots(slots, user) {
    return slots.filter(slot =>
        isBatchIncluded(user.batch, slot) &&
        isSubjectIncluded(user.subjects, slot)
    );
}

// list is the subject from yeardata
function getSubjectName(code, subjectsList) {
    const subject = subjectsList.find(item =>
        item["Full Code"] === code || item["Code"] === code
    );
    return subject ? subject["Subject"] : null;
}
function shouldUserAttend(slotString, user) {
    const batchIncluded = slotString.split('(')[0].includes(user.batch) || slotString.includes("ALL");
    const subjectIncluded = user.subjects.some(subject =>
        slotString.includes(subject)
    );

    return batchIncluded && subjectIncluded;
}

function parseSlot(slotString, subjectsList) {
    const normalized = slotString.trim();
    const match = normalized.match(/^([A-Z]+)([A-Z0-9]+)\(([^)]+)\)\s*-?\s*([^/]*)\/?(.*)$/);

    if (!match) {
        return {
            type: "L",
            name: normalized,
            code: "",
            room: "",
            teacher: ""
        };
    }

    const [, typePrefix, batch, subjectCode, room, teacher] = match;
    let type = typePrefix.charAt(0);
    if (!['L', 'P', 'T'].includes(type)) {
        type = 'L';
    }

    const subjectName = getSubjectName(subjectCode, subjectsList) || subjectCode;

    return {
        type: type,
        name: subjectName,
        code: subjectCode,
        room: room.trim(),
        teacher: teacher.trim()
    };
}

async function get_timetable(url, year) {
    try {
        let data = await getYearData(url, year);
        console.log(JSON.stringify(data?.timetable));
        return data;
    }catch(error) {
        alert(`Error getting timetable: ${error}`);
    }
}



export { getSubjects ,formatTimetable};