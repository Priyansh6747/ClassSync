use serde::{Deserialize, Serialize};
use serde::__private::de::IdentifierDeserializer;
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


    fn batch_extractor(input: &str) -> Vec<String> {
        let start_bracket = input.find('(');
        let batch_str = match start_bracket {
            None => "F1".to_string(),
            Some(n) => {
                input.chars().skip(1).take(n - 1).collect()
            }
        };
        if batch_str.to_ascii_uppercase() == "ALL" {
            return vec!["ALL".to_string()];
        }

        let mut result = Vec::new();
        let mut chars = batch_str.chars().peekable();

        while let Some(ch) = chars.next() {
            if ch.is_alphabetic() {
                let mut batch = String::new();
                batch.push(ch);

                if ch == 'A' && chars.peek() == Some(&'L') {
                    chars.next(); 
                    if chars.peek() == Some(&'l') {
                        chars.next(); 
                        result.push("All".to_string());
                        continue;
                    } else {
                        batch.push('l');
                    }
                }

                while let Some(&digit) = chars.peek() {
                    if digit.is_ascii_digit() {
                        batch.push(chars.next().unwrap());
                    } else {
                        break;
                    }
                }

                if batch.len() > 1 && batch != "Al" {
                    result.push(batch);
                }
            }
        }

        result
    }
    fn get_purpose(input: &str) -> String {
        input
            .trim()
            .chars()
            .next()
            .map(|c| c.to_ascii_uppercase().to_string())
            .unwrap_or_default()
    }
    fn get_course(input: &str) -> String {
        let open_bracket = input.find('(');
        if open_bracket.is_none() {
            return  "15B11PH111".to_string();
        }
        input.chars().skip(open_bracket.unwrap()+1).take(10).collect::<String>()
    }
    fn get_room(input: &str) -> String {
        let parts: Vec<&str> = input.split('-').collect();

        let location_part = if parts.len() < 2 {
            if let Some(paren_pos) = input.rfind(')') {
                &input[paren_pos + 1..]
            } else {
                return input.to_string();
            }
        } else {
            parts.last().unwrap()
        };

        let slash_parts: Vec<&str> = location_part.split('/').collect();

        let location = if slash_parts.len() >= 3 {
            slash_parts[1]
        } else if slash_parts.len() >= 1 {
            slash_parts[0]
        } else {
            location_part
        };

        location.trim().to_string()
    }
    fn get_teacher(input: &str) -> Vec<String> {
        let room = SlotRes::get_room(input);

        if room.is_empty() {
            if let Some(slash_pos) = input.find('/') {
                let teachers_part = input[slash_pos + 1..].trim();
                return teachers_part.split('/').map(|s| s.trim().to_string()).collect();
            }
            return vec![input.to_string()];
        }

        if let Some(room_pos) = input.find(&room) {
            let after_room = &input[room_pos + room.len()..];

            if let Some(slash_pos) = after_room.find('/') {
                let teachers_part = &after_room[slash_pos + 1..];
                return teachers_part
                    .split('/')
                    .map(|s| s.trim().to_string())
                    .filter(|s| !s.is_empty())
                    .collect();
            }
        }

        if let Some(slash_pos) = input.find('/') {
            let teachers_part = input[slash_pos + 1..].trim();
            return teachers_part.split('/').map(|s| s.trim().to_string()).collect();
        }

        vec![input.to_string()]
    }
    
    pub fn frm_str(input: &str) -> Self {
        let slot_purpose = Some(Self::get_purpose(input));
        let batch = Some(Self::batch_extractor(input));
        let course = Some(Self::get_course(input));
        let room = Some(Self::get_room(input));
        let teacher = Some(Self::get_teacher(input));
        Self {
            slot_purpose,
            batch,
            course,
            room,
            teacher
        }
    }

}

#[test]
fn test_main() {
    let a = SlotRes::frm_str("PF7F8F9(15B17CI373)/CL3/PAM/PRM/MIT");
    dbg!(a);
}

