use serde::{Deserialize, Serialize};

///Base Structs
#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Teacher {
    pub abbreviation: String,
    pub name : String,
}


#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct Teachers {
    pub(crate) list: Option<Vec<Teacher>>,
}

impl Teachers {
    // Helper method to find teacher by abbreviation
    pub fn find_by_abbreviation(&self, abbreviation: &str) -> Option<Teacher> {
        self.list.as_ref()?
            .iter()
            .find(|teacher| teacher.abbreviation == abbreviation)
            .cloned()
    }
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
    
    

    // Helper method to find subject by code across all categories
    pub fn find_by_code(&self, code: &str) -> Option<Subject> {
        let all_subjects = [&self.cs, &self.ec, &self.hs, &self.ph, &self.ma, &self.oth];

        for subject_list in all_subjects.iter() {
            if let Some(subjects) = subject_list {
                if let Some(subject) = subjects.iter().find(|s| s.code == code) {
                    return Some(subject.clone());
                }
            }
        }
        None
    }
}

#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct TimeSlot {
    pub(crate) start:u8,
    pub(crate) end:u8,
    pub(crate) duration:u8,
    pub(crate) relax_period:u8,
}

/// Actual Structs

//To Store and Send
#[derive(Serialize,Deserialize,Debug,Default, Clone)]
pub struct TimeTableMetaData {
    pub(crate) time : TimeSlot,
    pub(crate) teachers: Teachers,
    pub(crate) subjects: Subjects
}

impl TimeTableMetaData {
    //return the teacher whose abbreviation matches
    pub fn get_teacher(&self, abbreviation: String) -> Option<Teacher> {
        self.teachers.find_by_abbreviation(&abbreviation)
    }

    //return the subject whose code matches
    pub fn get_subject(&self, code: String) -> Option<Subject> {
        self.subjects.find_by_code(&code)
    }
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
