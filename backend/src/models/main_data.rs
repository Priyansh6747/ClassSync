use serde::{Deserialize, Serialize};
use crate::models::meta_data::{Subject, Teacher, TimeTableMetaData};

///Base structs for actual timetable
#[derive(Serialize,Deserialize,Debug,Default, Clone,PartialEq)]
pub struct Batch{
    prefix: String,
    distinction:u8
}

impl Batch {
    pub fn new(batch: &String) -> Option<Batch> {
        if batch.len() < 2 || batch.len() > 3 {
            return None;
        }

        let (prefix_char, number_str) = batch.split_at(1);
        let distinction = number_str.parse::<u8>().ok()?;

        match prefix_char {
            "F" if (1..=11).contains(&distinction) => Some(Batch {
                prefix: "F".to_string(),
                distinction,
            }),
            "E" if (15..=17).contains(&distinction) => Some(Batch {
                prefix: "E".to_string(),
                distinction,
            }),
            _ => None,
        }
    }
    fn get_all() -> Vec<Batch> {
        let mut out:Vec<Batch> = vec![];
        let mut prefix:String = "F".into();
        for i in 1..12u8 {
            out.push(Batch{
                prefix:prefix.clone(),
                distinction:i,
            })
        }
        prefix = "E".into();
        for i in 15..18u8 {
            out.push(Batch{
                prefix: prefix.clone(),
                distinction:i,
            })
        }
        out
    }
    fn parse_all(batch: &str) -> Option<Vec<Batch>> {
        match batch.to_lowercase().as_str() {
            "all" => Some(Self::get_all()),
            &_ => {None}
        }
    }
    
    pub fn parse_vec(batch_list: &Vec<String>) -> Option<Vec<Batch>> {
        let mut out:Vec<Batch> = vec![];
        if batch_list.len() == 1 && batch_list[0].to_ascii_lowercase() == "all" {
            Self::parse_all(&batch_list[0])
        }else {
            for i in batch_list.iter() {
                out.push(Batch::new(i)?)
            }
            Some(out)
        }
        
    }
}

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Slot {
    slot_type: Option<String>,
    batch: Option<Vec<Batch>>,
    course: Option<Subject>,
    room: Option<String>,
    teacher: Option<Vec<String>>,
}

//slot received via json
#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct SlotRes {
    slot_purpose: Option<String>,
    batch: Option<Vec<String>>,
    course: Option<String>,
    room: Option<String>,
    teacher: Option<Vec<Teacher>>,
}

impl SlotRes {
    pub fn transform(&self, meta_data: &TimeTableMetaData) -> Slot {
        Slot {
            slot_type: self.slot_purpose.clone(),

            batch: self.batch.as_ref().and_then(|batch_strings| {
                Batch::parse_vec(batch_strings)
            }),

            course: meta_data.get_subject(self.course.clone().unwrap()),

            room: self.room.clone(),

            teacher: self.teacher.as_ref().map(|teachers| {
                teachers.iter()
                    .map(|teacher| teacher.name.clone())
                    .collect()
            })
        }
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::meta_data::{Subject, Teacher, TimeTableMetaData, Subjects, Teachers, TimeSlot};

    fn create_test_metadata() -> TimeTableMetaData {
        let subjects = vec![
            Subject {
                name: "Data Structures".to_string(),
                code: "CS101".to_string(),
                tag: "CS".to_string(),
            },
            Subject {
                name: "Digital Circuits".to_string(),
                code: "EC201".to_string(),
                tag: "EC".to_string(),
            },
            Subject {
                name: "Physics Lab".to_string(),
                code: "PH301".to_string(),
                tag: "PH".to_string(),
            },
        ];

        let teachers = vec![
            Teacher {
                abbreviation: "JS".to_string(),
                name: "Dr. John Smith".to_string(),
            },
            Teacher {
                abbreviation: "MJ".to_string(),
                name: "Prof. Mary Johnson".to_string(),
            },
        ];

        TimeTableMetaData {
            time: TimeSlot {
                start: 9,
                end: 17,
                duration: 50,
                relax_period: 10,
            },
            teachers: Teachers { list: Some(teachers) },
            subjects: Subjects::new(subjects),
        }
    }

    #[test]
    fn test_transform_complete_slot() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Lecture".to_string()),
            batch: Some(vec!["F1".to_string(), "F2".to_string()]),
            course: Some("CS101".to_string()),
            room: Some("Room 101".to_string()),
            teacher: Some(vec![
                Teacher {
                    abbreviation: "JS".to_string(),
                    name: "Dr. John Smith".to_string(),
                }
            ]),
        };

        let transformed = slot_res.transform(&metadata);

        assert_eq!(transformed.slot_type, Some("Lecture".to_string()));
        assert_eq!(transformed.room, Some("Room 101".to_string()));

        // Check batches
        let batches = transformed.batch.unwrap();
        assert_eq!(batches.len(), 2);
        assert_eq!(batches[0], Batch { prefix: "F".to_string(), distinction: 1 });
        assert_eq!(batches[1], Batch { prefix: "F".to_string(), distinction: 2 });

        // Check course
        let course = transformed.course.unwrap();
        assert_eq!(course.name, "Data Structures");
        assert_eq!(course.code, "CS101");
        assert_eq!(course.tag, "CS");

        // Check teachers
        let teachers = transformed.teacher.unwrap();
        assert_eq!(teachers.len(), 1);
        assert_eq!(teachers[0], "Dr. John Smith");
    }

    #[test]
    fn test_transform_with_all_batches() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Assembly".to_string()),
            batch: Some(vec!["all".to_string()]),
            course: Some("PH301".to_string()),
            room: Some("Auditorium".to_string()),
            teacher: Some(vec![
                Teacher {
                    abbreviation: "MJ".to_string(),
                    name: "Prof. Mary Johnson".to_string(),
                }
            ]),
        };

        let transformed = slot_res.transform(&metadata);

        // Check that all batches are included
        let batches = transformed.batch.unwrap();
        assert_eq!(batches.len(), 14); // F1-F11 + E15-E17

        // Check first few batches
        assert_eq!(batches[0], Batch { prefix: "F".to_string(), distinction: 1 });
        assert_eq!(batches[10], Batch { prefix: "F".to_string(), distinction: 11 });
        assert_eq!(batches[11], Batch { prefix: "E".to_string(), distinction: 15 });

        // Check course lookup
        let course = transformed.course.unwrap();
        assert_eq!(course.name, "Physics Lab");
        assert_eq!(course.code, "PH301");
        assert_eq!(course.tag, "PH");
    }

    #[test]
    fn test_transform_with_mixed_valid_invalid_batches() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Lab".to_string()),
            batch: Some(vec!["F1".to_string(), "INVALID".to_string(), "F2".to_string()]),
            course: Some("EC201".to_string()),
            room: Some("Lab 1".to_string()),
            teacher: None,
        };

        let transformed = slot_res.transform(&metadata);

        // Should return None because one batch is invalid (parse_vec returns None on any failure)
        assert_eq!(transformed.batch, None);

        // Other fields should still work
        assert_eq!(transformed.slot_type, Some("Lab".to_string()));
        assert_eq!(transformed.room, Some("Lab 1".to_string()));
        assert_eq!(transformed.teacher, None);
    }

    #[test]
    fn test_transform_with_valid_batches_only() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Tutorial".to_string()),
            batch: Some(vec!["F1".to_string(), "E15".to_string(), "F11".to_string()]),
            course: Some("CS101".to_string()),
            room: Some("Tutorial Room".to_string()),
            teacher: None,
        };

        let transformed = slot_res.transform(&metadata);

        let batches = transformed.batch.unwrap();
        assert_eq!(batches.len(), 3);
        assert_eq!(batches[0], Batch { prefix: "F".to_string(), distinction: 1 });
        assert_eq!(batches[1], Batch { prefix: "E".to_string(), distinction: 15 });
        assert_eq!(batches[2], Batch { prefix: "F".to_string(), distinction: 11 });
    }

    #[test]
    #[should_panic(expected = "called `Option::unwrap()` on a `None` value")]
    fn test_transform_with_none_course_panics() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Study Hall".to_string()),
            batch: Some(vec!["F1".to_string()]),
            course: None, // This will cause panic
            room: Some("Library".to_string()),
            teacher: None,
        };

        let _transformed = slot_res.transform(&metadata);
    }

    #[test]
    #[should_panic(expected = "called `Option::unwrap()` on a `None` value")]
    fn test_transform_with_unknown_course_panics() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: Some("Study Hall".to_string()),
            batch: Some(vec!["F1".to_string()]),
            course: Some("UNKNOWN".to_string()), // This will cause panic since get_subject returns None
            room: Some("Library".to_string()),
            teacher: None,
        };

        let _transformed = slot_res.transform(&metadata);
    }

    #[test]
    fn test_transform_empty_slot() {
        let metadata = create_test_metadata();

        let slot_res = SlotRes {
            slot_purpose: None,
            batch: None,
            course: Some("CS101".to_string()), // Still need valid course to avoid panic
            room: None,
            teacher: None,
        };

        let transformed = slot_res.transform(&metadata);

        assert_eq!(transformed.slot_type, None);
        assert_eq!(transformed.batch, None);
        assert_eq!(transformed.room, None);
        assert_eq!(transformed.teacher, None);

        // Course should still be found
        let course = transformed.course.unwrap();
        assert_eq!(course.code, "CS101");
    }
    

    #[test]
    fn test_transform_edge_case_batches() {
        let metadata = create_test_metadata();

        // Test with edge case batches
        let slot_res = SlotRes {
            slot_purpose: Some("Special Class".to_string()),
            batch: Some(vec!["E17".to_string(), "F11".to_string()]), // Edge cases
            course: Some("PH301".to_string()),
            room: Some("Special Room".to_string()),
            teacher: None,
        };

        let transformed = slot_res.transform(&metadata);

        let batches = transformed.batch.unwrap();
        assert_eq!(batches.len(), 2);
        assert_eq!(batches[0], Batch { prefix: "E".to_string(), distinction: 17 });
        assert_eq!(batches[1], Batch { prefix: "F".to_string(), distinction: 11 });
    }

    #[test]
    fn test_str_to_batch() {
        let batch = Batch{prefix: "F".into(), distinction:1};
        assert_eq!(Batch::new(&String::from("F1")).unwrap(), batch);
    }
}
