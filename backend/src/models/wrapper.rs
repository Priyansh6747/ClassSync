use std::collections::HashMap;
use std::io::ErrorKind;
use serde::{Deserialize, Serialize};
use crate::models::main_data::{Slot,SlotRes};
use crate::models::meta_data::TimeTableMetaData;
use bcrypt::{hash, verify, DEFAULT_COST,BcryptError};

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct TimeStamp{
    pub hr:u8,
    pub min:u8,
}
#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Column{
    pub start_time:TimeStamp,
    pub duration:u16,
    pub schedules:Vec<Slot>,
}

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct ColumnRes{
    pub start_time:TimeStamp,
    pub duration:u16,
    pub schedules:Vec<SlotRes>,
}

impl ColumnRes{
    pub fn transform(&self , meta_data:&TimeTableMetaData) -> Column{
        let mut new_slots = Vec::new();
        for i in &self.schedules {
            new_slots.push(i.transform(meta_data));
        }
        Column{
            start_time: self.start_time.clone(),
            duration: self.duration,
            schedules: new_slots,
        }
    }

    fn get_start_time(time: &str) -> u16 {
        let start_part = time.trim().split(" - ").next().unwrap_or("");
        let full_time = time.trim();
        let am_pm = if full_time.ends_with("AM") {
            "AM"
        } else if full_time.ends_with("PM") {
            "PM"
        } else {
            ""
        };
        let hour_str = start_part.split(':').next()
            .or_else(|| start_part.split('-').next())
            .unwrap_or("0")
            .trim();

        let hour = hour_str.parse::<u16>().unwrap_or(0);

        match am_pm {
            "PM" => {
                if hour == 12 {
                    12
                } else {
                    hour + 12
                }
            },
            "AM" => {
                if hour == 12 {
                    0
                } else {
                    hour
                }
            },
            _ => hour
        }
    }

    fn get_duration(time: &str) -> u16 {
        let parts: Vec<&str> = time.split(" - ").collect();
        let start_time = parts[0].trim();
        let end_time = parts[1].trim();

        fn parse_time(time_str: &str) -> u16 {
            let (time_part, period) = if time_str.contains(" ") {
                let parts: Vec<&str> = time_str.split_whitespace().collect();
                (parts[0], parts[1])
            } else {
                if time_str.ends_with("AM") {
                    (&time_str[..time_str.len()-2], "AM")
                } else {
                    (&time_str[..time_str.len()-2], "PM")
                }
            };

            let time_components: Vec<&str> = time_part.split(':').collect();
            let hours: u16 = time_components[0].parse().unwrap();
            let minutes: u16 = time_components[1].parse().unwrap();

            let total_minutes = match period {
                "AM" => if hours == 12 { minutes } else { hours * 60 + minutes },
                "PM" => if hours == 12 { 12 * 60 + minutes } else { (hours + 12) * 60 + minutes },
                _ => hours * 60 + minutes,
            };

            total_minutes
        }

        let start_minutes = parse_time(start_time);
        let end_minutes = parse_time(end_time);

        if end_minutes >= start_minutes {
            end_minutes - start_minutes
        } else {
            (24 * 60) - start_minutes + end_minutes
        }
    }

    pub fn frm_json(time : &str , slots: &Vec<String>) ->Self {
        let start_time = TimeStamp{
            hr : ColumnRes::get_start_time(time) as u8,
            min: 0
        };
        let duration = ColumnRes::get_duration(time);
        let mut schedules:Vec<SlotRes> = vec![];
        for s in slots {
            let res = SlotRes::frm_str(s);
            schedules.push(res);
        }
        Self{
            start_time,
            duration,
            schedules
        }
    }
}


#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Day {
    pub day:u8,
    pub cols: Vec<Column>,
}
#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct DayRes {
    pub day:u8,
    pub cols: Vec<ColumnRes>,
}
impl DayRes{
    pub fn transform(&self, meta_data:&TimeTableMetaData) -> Day{
        let mut new_slots = Vec::new();
        for i in &self.cols {
            new_slots.push(i.transform(meta_data));
        }
        Day{
            day: self.day,
            cols: new_slots,
        }
    }
}

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct TimeTable{
    year:u8,
    days:Vec<Day>,
}

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Collection{
    timetables:Vec<TimeTable>,
}
impl Collection{
    pub fn get_timetables(&self) -> Vec<TimeTable>{
        self.timetables.clone()
    }
}

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct TimeTableRes{
    ver:u8,
    days:Vec<DayRes>,
}
impl TimeTableRes{
    pub fn transform(&self, meta_data:&TimeTableMetaData) -> TimeTable{
        let mut new_slots = Vec::new();
        for i in &self.days {
            new_slots.push(i.transform(meta_data));
        }
        TimeTable{
            year: self.ver,
            days: new_slots,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct MetaData{
    pub version:u16,
    pub data: TimeTableMetaData
}
impl MetaData {
    pub fn merge(&self , new:&TimeTableMetaData) -> MetaData {
        MetaData{
            version: self.version + 1,
            data: self.data.merge(new)
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Res {
    pub key: String,
    pub timetable: Option<TimeTableRes>,
}

impl Res {
    pub fn transform(&self, meta_data: &TimeTableMetaData) -> Result<TimeTable, BcryptError> {
        let stored_hash = "$2b$12$p6iy1Fciwj.IasMAVBEhOODdgfoQZx3vFsiP2m8Uql.sA9Cc9/e9W";

        if verify(&self.key, &stored_hash)? {
            if let Some(timetable) = &self.timetable {
                Ok(timetable.transform(meta_data))
            } else {
                Err(BcryptError::Io(std::io::Error::new(ErrorKind::InvalidData,"Bad Data"))) 
            }
        } else {
            Err(BcryptError::Io(std::io::Error::new(ErrorKind::InvalidData,"Bad Auth")))
        }
    }
}

fn gen_hash(password:&str) -> Result<String, BcryptError> {
    hash(password, DEFAULT_COST)
}

#[cfg(test)]
mod tests{
    use super::*;
    #[test]
    fn get_hash() {
        let a =gen_hash("Pass").unwrap();
        dbg!(a);
        assert_eq!(2,2);
    }
    #[test]
    fn test_verify() {
        let stored_hash = "$2b$12$YtQs1d9.s3GX8KP3GoY13OEOmo.Z2lPl/wn0ZHK4KEUkcs6UD57h2".to_string();
        let a = verify("Pass",&stored_hash);
        assert!(a.is_ok() && a.unwrap());
    }
}