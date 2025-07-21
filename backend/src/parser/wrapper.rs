use axum::Json;
use pdf_extract::extract_text_by_pages;
use crate::parser::ai_parse::ai_parse;
use crate::parser::models::{TimeTableinfo};

pub async fn get_timetable(path:&str) -> Json<TimeTableinfo> {
    let content = get_pdf_text(path);
    let timetable = ai_parse(&content).await;
    timetable.to_json()
}

fn get_pdf_text(path: &str) -> String {
    let full_content =extract_text_by_pages(path).expect(&format!("Could not extract pdf file: {}", path));
    let needed_content = &full_content[full_content.len()-1];
    String::from(needed_content)
}

#[tokio::test]
async fn test_get_timetable() {
    let a = get_timetable("sample/TT.pdf").await;

    let teachers_len = a.teachers.as_ref().map(|t| t.len()).unwrap_or(0);
    let subjects_len = a.subjects.as_ref().map(|s| s.len()).unwrap_or(0);

    println!("teachers: {:?} subject {:?}", teachers_len, subjects_len);
    dbg!(&a);
}
