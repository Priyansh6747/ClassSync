use serde::{Deserialize, Serialize};

///Base Structs
#[derive(Serialize,Deserialize,Debug,Default, Clone,PartialEq)]
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

    // Update to merge teachers from new_list into self
   fn update(&mut self, new_list: &Teachers) {
        if self.list.is_none() {
            self.list = Some(Vec::new());
        }
        let Some(ref new_teachers) = new_list.list else {
            return;
        };

        let self_list = self.list.as_mut().unwrap(); 

        for new_teacher in new_teachers {
            if !self_list.iter().any(|existing| existing == new_teacher) {
                self_list.push(new_teacher.clone());
            }
        }
    }
    pub fn merge(&self, new_list: &Teachers) -> Teachers {
        let mut result = self.clone();
        result.update(new_list);
        result
    }
}


#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Subject {
    pub name: String,
    pub code: String,
    pub tag: String, // CS EC HS PH MA OTH
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct Subjects {
    pub cs: Option<Vec<Subject>>,
    pub ec: Option<Vec<Subject>>,
    pub hs: Option<Vec<Subject>>,
    pub ph: Option<Vec<Subject>>,
    pub ma: Option<Vec<Subject>>,
    pub oth: Option<Vec<Subject>>,
}

impl Subjects {
    pub fn new(res: Vec<Subject>) -> Self {
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
                _ => out.oth.as_mut().unwrap().push(i),
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

    // Helper method to get mutable reference to the appropriate category
    fn get_category_mut(&mut self, tag: &str) -> &mut Option<Vec<Subject>> {
        match tag.to_lowercase().as_str() {
            "cs" => &mut self.cs,
            "ec" => &mut self.ec,
            "hs" => &mut self.hs,
            "ph" => &mut self.ph,
            "ma" => &mut self.ma,
            _ => &mut self.oth,
        }
    }

    // Update to merge subjects from new_list into self
    fn update(&mut self, new_list: &Subjects) {
        self.merge_category(&new_list.cs, "cs");
        self.merge_category(&new_list.ec, "ec");
        self.merge_category(&new_list.hs, "hs");
        self.merge_category(&new_list.ph, "ph");
        self.merge_category(&new_list.ma, "ma");
        self.merge_category(&new_list.oth, "oth");
    }

    // Helper to merge a single category
    fn merge_category(&mut self, new_subjects: &Option<Vec<Subject>>, tag: &str) {
        let Some(new_list) = new_subjects else {
            return;
        };

        let category = self.get_category_mut(tag);
        if category.is_none() {
            *category = Some(Vec::new());
        }

        let self_list = category.as_mut().unwrap();

        for new_subject in new_list {
            if !self_list.iter().any(|existing| existing.code == new_subject.code) {
                self_list.push(new_subject.clone());
            }
        }
    }

    // Merge method that returns a new Subjects instance
    pub fn merge(&self, new_list: &Subjects) -> Subjects {
        let mut result = self.clone();
        result.update(new_list);
        result
    }

    pub fn update_or_add(&mut self, new_list: &Subjects) {
        self.update_or_add_category(&new_list.cs, "cs");
        self.update_or_add_category(&new_list.ec, "ec");
        self.update_or_add_category(&new_list.hs, "hs");
        self.update_or_add_category(&new_list.ph, "ph");
        self.update_or_add_category(&new_list.ma, "ma");
        self.update_or_add_category(&new_list.oth, "oth");
    }

    fn update_or_add_category(&mut self, new_subjects: &Option<Vec<Subject>>, tag: &str) {
        let Some(new_list) = new_subjects else {
            return;
        };

        let category = self.get_category_mut(tag);

        if category.is_none() {
            *category = Some(Vec::new());
        }

        let self_list = category.as_mut().unwrap();

        for new_subject in new_list {
            if let Some(existing_subject) = self_list.iter_mut()
                .find(|s| s.code == new_subject.code) {
                *existing_subject = new_subject.clone();
            } else {
                self_list.push(new_subject.clone());
            }
        }
    }

    // Get all subjects as a flat Vec
    pub fn get_all_subjects(&self) -> Vec<Subject> {
        let mut all = Vec::new();
        let categories = [&self.cs, &self.ec, &self.hs, &self.ph, &self.ma, &self.oth];

        for category in categories {
            if let Some(subjects) = category {
                all.extend(subjects.iter().cloned());
            }
        }

        all
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
    pub time : TimeSlot,
    pub teachers: Teachers,
    pub subjects: Subjects
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
    
    pub fn merge(&self,data:&TimeTableMetaData) -> TimeTableMetaData {
        TimeTableMetaData{
            time: data.time.clone(),
            teachers: self.teachers.merge(&data.teachers),
            subjects: self.subjects.merge(&data.subjects),
        }
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
