use serde::{Deserialize, Serialize};
use crate::models::meta_data::{Subject, Teacher, TimeTableMetaData};

///Base structs for actual timetable
#[derive(Serialize,Deserialize,Debug,Default, Clone,PartialEq)]
pub struct Batch{
    pub(crate) prefix: String,
    pub(crate) distinction:u8
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
    pub slot_type: Option<String>,
    pub batch: Option<Vec<Batch>>,
    pub course: Option<Subject>,
    pub room: Option<String>,
    pub teacher: Option<Vec<Teacher>>,
    pub duration:i32,
}

//slot received via json
#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct SlotRes {
    pub(crate) slot_purpose: Option<String>,
    pub(crate) batch: Option<Vec<String>>,
    pub(crate) course: Option<String>,
    pub(crate) room: Option<String>,
    pub(crate) teacher: Option<Vec<String>>,
}

impl SlotRes {
    fn get_duration(&self) ->i32 {
        match &self.slot_purpose {
            None => {0}
            Some(purpose) => {
                match purpose.as_str() {
                    "L" => 50,
                    "T" => 50,
                    "P" => 50 + 60,
                    _ => 50,
                }
            }
        }
    }
    pub fn transform(&self, meta_data: &TimeTableMetaData) -> Slot {
        let teachers = if let Some(teacher_names) = &self.teacher {
            let mut teaches: Vec<Teacher> = Vec::new();
            for teacher_name in teacher_names {
                let a = meta_data.get_teacher(teacher_name.clone());
                if a.is_some() {
                    teaches.push(a.unwrap());
                }
            }
            if teaches.is_empty() {
                None
            } else {
                Some(teaches)
            }
        } else {
            None
        };

        Slot {
            slot_type: self.slot_purpose.clone(),
            batch: self.batch.as_ref().and_then(|batch_strings| {
                Batch::parse_vec(batch_strings)
            }),
            course: self.course.as_ref().and_then(|code| meta_data.get_subject(code.clone())),
            room: self.room.clone(),
            teacher: teachers,
            duration: self.get_duration()
        }
    }
}

