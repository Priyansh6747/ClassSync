use serde::{Deserialize, Serialize};

///Base Structs
#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Teacher {
    pub abbreviation: String,
    pub name : String,
}


#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Teachers {
    list: Option<Vec<Teacher>>,
}


#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Subject {
    pub name: String,
    pub code : String,
    pub tag: String, // CS EC HS PH MA OTH
}



#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Subjects {
    pub cs : Option<Vec<Subject>>,
    pub ec : Option<Vec<Subject>>,
    pub hs : Option<Vec<Subject>>,
    pub ph : Option<Vec<Subject>>,
    pub ma : Option<Vec<Subject>>,
    pub oth : Option<Vec<Subject>>,
}

impl Subjects {
    pub fn new(res : Vec<Subject>) -> Self {
        let mut out = Self {
            cs: Some(Vec::new()),
            ec: Some(Vec::new()),
            hs: Some(Vec::new()),
            ph: Some(Vec::new()),
            ma: Some(Vec::new()),
            oth: Some(Vec::new()),
        };

        for i in res {
            match i.tag.to_lowercase().as_str() {
                "cs" => out.cs.as_mut().unwrap().push(i),
                "ec" => out.ec.as_mut().unwrap().push(i),
                "hs" => out.hs.as_mut().unwrap().push(i),
                "ph" => out.ph.as_mut().unwrap().push(i),
                "ma" => out.ma.as_mut().unwrap().push(i),
                _    => out.oth.as_mut().unwrap().push(i),
            }
        }

        out
    }
}

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct TimeSlot {
    start:u8,
    end:u8,
    duration:u8,
    relax_period:u8,
}

/// Actual Structs

//To Store and Send
#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct TimeTableMetaData {
    time : TimeSlot,
    teachers: Teachers,
    subjects: Subjects
}


//To receive
#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct TimeTableInfo {
    time : TimeSlot,
    teachers: Vec<Teacher>,
    subjects: Vec<Subject>,
}

impl TimeTableInfo {
    pub fn transform(&self) -> TimeTableMetaData {
        let a = self.clone();
        TimeTableMetaData{ 
            time :a.time,
            teachers: Teachers{list:Some(a.teachers)},
            subjects: Subjects::new(a.subjects)
        }
    }
}