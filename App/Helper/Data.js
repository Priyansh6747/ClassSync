function getDayContent(day,TimeTable) {
    if (!TimeTable || !TimeTable.days)
        return;
    for(let i =0 ; i < TimeTable.days.length ; i++ ){
        if(TimeTable.days[i] && TimeTable.days[i].day === day ){
            return TimeTable.days[i].cols;
        }
    }
}

export {getDayContent}