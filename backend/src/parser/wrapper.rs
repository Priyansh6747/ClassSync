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

