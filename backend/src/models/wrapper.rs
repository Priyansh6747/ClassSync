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
    version:u8,
    days:Vec<Day>,
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
            version: self.ver,
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
    pub fn verify(&self, meta_data: &TimeTableMetaData) -> Result<TimeTable, BcryptError> {
        dotenv::dotenv().ok();
        let stored_hash = "$2b$12$p6iy1Fciwj.IasMAVBEhOODdgfoQZx3vFsiP2m8Uql.sA9Cc9/e9W";

        if verify(&self.key, &stored_hash)? {
            if let Some(timetable) = &self.timetable {
                Ok(timetable.transform(meta_data))
            } else {
                Err(BcryptError::Io(std::io::Error::new(ErrorKind::InvalidData,""))) 
            }
        } else {
            Err(BcryptError::Io(std::io::Error::new(ErrorKind::InvalidData,"")))
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