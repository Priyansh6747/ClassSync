use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::models::wrapper::Column;

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


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Timetable {
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
    #[serde(rename = "SAT", skip_serializing_if = "Option::is_none")]
    pub saturday: Option<DaySchedule>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct YearData {
    pub timetable: Timetable,
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
            "SAT" | "SATURDAY" => self.timetable.saturday.as_ref(),
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


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_deserialization() {
        let json_data = r#"
        {
            "1": {
                "timetable": {
                    "MON": {
                        "9 - 9:50 AM": [
                            "LE3E4(15B11PH111) -123 /SHALU"
                        ]
                    },
                    "TUES": {
                        "9 - 9:50 AM": []
                    },
                    "WED": {
                        "9 - 9:50 AM": []
                    },
                    "THUR": {
                        "9 - 9:50 AM": []
                    },
                    "FRI": {
                        "9 - 9:50 AM": []
                    }
                },
                "subjects": [
                    {
                        "Code": "15B11PH111",
                        "Full Code": "15B11PH111",
                        "Subject": "Physics-1"
                    }
                ]
            }
        }
        "#;

        let timetable: Result<TimetableData, _> = serde_json::from_str(json_data);
        assert!(timetable.is_ok());

        let timetable = timetable.unwrap();
        let year_1 = timetable.get_year_data("1").unwrap();
        assert_eq!(year_1.subjects.len(), 1);
        assert_eq!(year_1.subjects[0].subject, "Physics-1");
    }
}