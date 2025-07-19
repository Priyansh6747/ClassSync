use axum::Json;
use serde::{Deserialize, Serialize};

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Teacher {
    pub abbreviation: String,
    pub name : String,
}


#[derive(Serialize,Deserialize,Debug,Default,Clone)]
pub struct Subject {
    pub code : String,
    pub title : String,
}

#[derive(Serialize,Deserialize,Debug,Default,Clone)]
pub struct TimeTable {
    pub teachers: Option<Vec<Teacher>>,
    pub subjects: Option<Vec<Subject>>,
}

impl TimeTable {
    pub fn to_json(&self) -> Json<TimeTable> {
        Json(self.clone())
    }
}
