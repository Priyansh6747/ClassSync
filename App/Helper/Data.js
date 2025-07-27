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

export { getSubjects };