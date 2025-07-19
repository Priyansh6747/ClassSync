use axum::Json;
use serde::{Deserialize, Serialize};

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Teach {
    pub abbreviation: String,
    pub name : String,
}


#[derive(Serialize,Deserialize,Debug,Default,Clone)]
pub struct Subject {
    pub code : String,
    pub title : String,
}

#[derive(Serialize,Deserialize,Debug,Default,Clone)]
pub struct TimeTableinfo {
    pub teachers: Option<Vec<Teach>>,
    pub subjects: Option<Vec<Subject>>,
}

impl TimeTableinfo {
    pub fn to_json(&self) -> Json<TimeTableinfo> {
        Json(self.clone())
    }
}
