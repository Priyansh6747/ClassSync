use serde::{Deserialize, Serialize};
use crate::models::main_data::{Slot,SlotRes};
use crate::models::meta_data::TimeTableMetaData;

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
    id:u8,
    days:Vec<Day>,
}

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct TimeTableRes{
    id:u8,
    days:Vec<DayRes>,
}
impl TimeTableRes{
    pub fn transform(&self, meta_data:&TimeTableMetaData) -> TimeTable{
        let mut new_slots = Vec::new();
        for i in &self.days {
            new_slots.push(i.transform(meta_data));
        }
        TimeTable{
            id: self.id,
            days: new_slots,
        }
    }
}