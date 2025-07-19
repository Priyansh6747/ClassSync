use crate::parser::models::TimeTable;
use dotenv::dotenv;
use gemini_light_rs::Client;
use serde::de::DeserializeOwned;
use std::env;


fn ai_res_decoder<T: DeserializeOwned>(
    msg_ctx: &String,
) -> T {
    let decoded_res: Result<T, serde_json::Error> = serde_json::from_str(msg_ctx);
    let res = match decoded_res {
        Ok(res) => res,
        Err(_) => panic!("Failed to deserialize LLM response")
    };
    res
}

fn get_prompt(content: &str) -> String {
    
    let initial_prompt = r#"Parse the given timetable Make sure to read every detail and do not halucinate
    the output must be of the format specified and only ouput a json nothing more
    any response that do not abide byt these rules will result in harsh punishments
    The content given is of a time table pdf it have 3 section the time table , faculty section , course section
    use respective sections to get relevent info any extras are bad 
    the output format must be 
    {
        "teachers" : [{"abbreviation": "PKS", "name" : "Pankaj Kumar Shrivastva"},......],
        "subjects": [{"code":"16B1NHS432", "title":"Positive Psychology"},.....]
    }
    "#;
    
    let extended_prompt = format!("{} the content of time table is {}",initial_prompt,content);
    
    extended_prompt
}

pub async fn ai_parse(content: &str) -> TimeTable {
    dotenv().ok();
    let api_key = env::var("GEMINI_API_KEY").expect("GEMINI_API_KEY not set");
    let model = env::var("GEMINI_MODEL").expect("GEMINI_MODEL not set");
    let mut client = Client::new(&api_key,&model);
    let prompt = get_prompt(&content);
    let ai_res = client.chat(&*prompt).await.expect("No valid response from AI");
    let timetable: TimeTable = ai_res_decoder(&ai_res);
    timetable
}

