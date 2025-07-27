use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::str::FromStr;
use crate::models::wrapper::{Column, ColumnRes, DayRes, TimeTable};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Subject {
    #[serde(rename = "Code")]
    pub code: String,
    #[serde(rename = "Full Code")]
    pub full_code: String,
    #[serde(rename = "Subject")]
    pub subject: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DaySchedule {
    #[serde(flatten)]
    pub time_slots: HashMap<String, Vec<String>>,
}
impl DaySchedule {
    pub fn transform(&self) ->Vec<ColumnRes> {
        let mut cols: Vec<ColumnRes> = vec![];
        for i in &self.time_slots {
            let (date,slots) = i;
            let col = ColumnRes::frm_json(date,slots);
            cols.push(col);
        }
        cols
    }
}



#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtTimetable {
    #[serde(rename = "MON")]
    pub monday: DaySchedule,
    #[serde(rename = "TUES")]
    pub tuesday: DaySchedule,
    #[serde(rename = "WED")]
    pub wednesday: DaySchedule,
    #[serde(rename = "THUR")]
    pub thursday: DaySchedule,
    #[serde(rename = "FRI")]
    pub friday: DaySchedule,
    #[serde(rename = "SAT")]
    pub saturday:DaySchedule,
}

impl ExtTimetable {
    pub fn transform(&self) ->TimeTable {
        let mut days: Vec<DayRes> = vec![];

        let mon = DayRes {
            day: 0,
            cols: self.monday.transform(),
        };
        days.push(mon);

        let tues = DayRes {
            day: 1,
            cols: self.tuesday.transform(),
        };
        days.push(tues);

        let wed = DayRes {
            day: 2,
            cols: self.wednesday.transform(),
        };
        days.push(wed);

        let thurs = DayRes {
            day: 3,
            cols: self.thursday.transform(),
        };
        days.push(thurs);

        let fri = DayRes {
            day: 4,
            cols: self.friday.transform(),
        };
        days.push(fri);

        let sat = DayRes {
            day: 5,
            cols: self.saturday.transform(),
        };
        days.push(sat);
        todo!()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct YearData {
    pub timetable: ExtTimetable,
    pub subjects: Vec<Subject>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TimetableData {
    #[serde(flatten)]
    pub years: HashMap<String, YearData>,
}


// Helper methods for easier access
impl TimetableData {
    pub fn get_year_data(&self, year: &str) -> Option<&YearData> {
        self.years.get(year)
    }

    pub fn get_all_years(&self) -> Vec<&String> {
        self.years.keys().collect()
    }
}

impl YearData {
    pub fn get_subject_by_code(&self, code: &str) -> Option<&Subject> {
        self.subjects.iter().find(|s| s.code == code)
    }

    pub fn get_day_schedule(&self, day: &str) -> Option<&DaySchedule> {
        match day.to_uppercase().as_str() {
            "MON" | "MONDAY" => Some(&self.timetable.monday),
            "TUES" | "TUESDAY" => Some(&self.timetable.tuesday),
            "WED" | "WEDNESDAY" => Some(&self.timetable.wednesday),
            "THUR" | "THURSDAY" => Some(&self.timetable.thursday),
            "FRI" | "FRIDAY" => Some(&self.timetable.friday),
            "SAT" | "SATURDAY" => Some(&self.timetable.saturday),
            _ => None,
        }
    }
}

impl DaySchedule {
    pub fn get_classes_at_time(&self, time_slot: &str) -> Option<&Vec<String>> {
        self.time_slots.get(time_slot)
    }

    pub fn get_all_time_slots(&self) -> Vec<&String> {
        self.time_slots.keys().collect()
    }
}


#[derive(Debug)]
struct TimeInfo {
    start: u32,
    dur: u32,
}

fn parse_time_block(input: &str) -> Option<TimeInfo> {
    let parts: Vec<&str> = input.split('-').collect();
    if parts.len() != 2 {
        return None;
    }

    let start_str = parts[0].trim();
    let end_str = parts[1].trim();

    // Check if AM/PM is only at the end
    let end_upper = end_str.to_uppercase();
    let has_am_pm_at_end = end_upper.contains("AM") || end_upper.contains("PM");
    let start_has_am_pm = start_str.to_uppercase().contains("AM") || start_str.to_uppercase().contains("PM");

    let (start_time, end_time) = if has_am_pm_at_end && !start_has_am_pm {
        // Apply the AM/PM from end to start as well
        let am_pm_suffix = if end_upper.contains("AM") { " AM" } else { " PM" };
        let start_with_suffix = format!("{}{}", start_str, am_pm_suffix);
        (parse_time(&start_with_suffix)?, parse_time(end_str)?)
    } else {
        (parse_time(start_str)?, parse_time(end_str)?)
    };

    let start_minutes = start_time.0 * 60 + start_time.1;
    let end_minutes = end_time.0 * 60 + end_time.1;

    if end_minutes < start_minutes {
        return None; 
    }

    Some(TimeInfo {
        start: start_time.0,
        dur: end_minutes - start_minutes,
    })
}

fn parse_time(time_str: &str) -> Option<(u32, u32)> {
    let time_str = time_str.to_uppercase();
    let is_pm = time_str.contains("PM");
    let is_am = time_str.contains("AM");

    let time_clean = time_str.replace("AM", "").replace("PM", "");
    let parts: Vec<&str> = time_clean.trim().split(':').collect();

    if parts.len() != 2 {
        return None;
    }

    let hour = u32::from_str(parts[0].trim()).ok()?;
    let minute = u32::from_str(parts[1].trim()).ok()?;

    if hour > 12 || minute >= 60 {
        return None;
    }

    let hour24 = if hour == 12 {
        if is_am { 0 } else { 12 }
    } else {
        if is_pm { hour + 12 } else { hour }
    };

    Some((hour24, minute))
}


