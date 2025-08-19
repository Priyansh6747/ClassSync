mod parser;
mod models;
mod test;
mod db;

use crate::db::config::MongoConnection;
use crate::models::meta_data::TimeTableInfo;
use crate::models::wrapper::{MetaData, Res, TimeTable};
use axum::http::StatusCode;
use axum::{routing::{get, post}, Json, Router, extract::State};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use axum::response::IntoResponse;
use tokio;
use tower_http::cors::{Any, CorsLayer};
use reqwest::{Client, Error, Response};
use crate::models::ext::TimetableData;
use std::fs;
use axum::routing::head;

#[derive(Serialize)]
struct Message {
    msg: String,
}

#[derive(Deserialize)]
struct Input {
    name: String,
}

// Shared application state
#[derive(Clone)]
struct AppState {
    db_name: String,
}

// Helper function for consistent error handling
fn mongo_error_response(e: impl std::fmt::Display) -> (StatusCode, Json<Message>) {
    (StatusCode::INTERNAL_SERVER_ERROR, Json(Message {
        msg: format!("Database error: {}", e)
    }))
}

fn success_response(msg: &str) -> Json<Message> {
    Json(Message { msg: msg.to_string() })
}

#[tokio::main]
async fn main() {
    // Shared state
    let state = AppState {
        db_name: "class_sync".to_string(),
    };

    // Create CORS layer
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/new", head(health_check))
        .route("/metadata", post(set_metadata))
        .route("/metadata", get(get_metadata))
        .route("/timetable", post(set_time_table))
        .route("/timetable", get(get_time_table))
        .route("/ext/timetable", get(fetch_and_process))
        .route("/data", get(get_data_json))  
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("Failed to bind to address");

    println!("Server running on http://localhost:3000");

    axum::serve(listener, app)
        .await
        .expect("Server failed to start");
}

async fn health_check() -> Json<Message> {
    success_response("Hello, JSON World!")
}

async fn set_metadata(
    State(state): State<AppState>,
    Json(payload): Json<TimeTableInfo>
) -> Result<Json<Message>, (StatusCode, Json<Message>)> {
    let res = payload.transform();
    let mongo = MongoConnection::new().await
        .map_err(mongo_error_response)?;

    mongo.add_meta_data(&state.db_name, res).await
        .map_err(mongo_error_response)?;

    Ok(success_response("Success"))
}

async fn get_metadata(
    State(state): State<AppState>
) -> Result<Json<MetaData>, (StatusCode, Json<Message>)> {
    let mongo = MongoConnection::new().await
        .map_err(mongo_error_response)?;

    let meta_data = mongo.get_metadata(&state.db_name).await
        .map_err(|e| (StatusCode::NOT_FOUND, Json(Message {
            msg: format!("Metadata not found: {}", e)
        })))?;

    Ok(Json(meta_data))
}

async fn set_time_table(
    State(state): State<AppState>,
    Json(payload): Json<Res>
) -> Result<Json<Message>, (StatusCode, Json<Message>)> {
    let mongo = MongoConnection::new().await
        .map_err(mongo_error_response)?;

    let meta_data = mongo.get_metadata(&state.db_name).await
        .map_err(|_| (StatusCode::BAD_REQUEST, success_response("Error getting metadata")))?;

    let time_table = payload.transform(&meta_data.data)
        .map_err(|_| (StatusCode::BAD_REQUEST, success_response("Unable to verify key")))?;

    let _ =mongo.add_time_table(&state.db_name, time_table).await;
    Ok(success_response("Success"))
}

async fn get_time_table(
    State(state): State<AppState>
) -> Result<Json<TimeTable>, (StatusCode, Json<Message>)> {
    let mongo = MongoConnection::new().await
        .map_err(mongo_error_response)?;

    let timetable = mongo.get_timetable(&state.db_name).await
        .map_err(|e| (StatusCode::NOT_FOUND, Json(Message {
            msg: format!("Timetable not found: {}", e)
        })))?;

    Ok(Json(timetable))
}

async fn fetch_and_process() -> Json<Message> {
    let client = Client::new();

    let url = "https://simple-timetable.tashif.codes/data/time-table/ODD25/128.json";
    let res = client.get(url).send().await;
    match res {
        Ok(t) => {
            let data = t.json::<TimetableData>().await;
            if let Ok(data) = data {
                dbg!(data);
                return Json(Message{msg: "Timetable process successfully".to_string()})
            }
            Json(Message{msg: "Unable to parse".to_string()})
        }
        Err(_) => {
            Json(Message{msg: "Error".to_string()})
        }
    }
}


async fn get_data_json() -> impl IntoResponse {
    let file_path = "data.json";

    match fs::read_to_string(file_path) {
        Ok(content) => {
            // Parse to ensure it's valid JSON
            match serde_json::from_str::<serde_json::Value>(&content) {
                Ok(json_value) => {
                    (StatusCode::OK, Json(json_value))
                }
                Err(_) => {
                    (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({
                        "error": "Invalid JSON format in data.json"
                    })))
                }
            }
        }
        Err(_) => {
            (StatusCode::NOT_FOUND, Json(serde_json::json!({
                "error": "data.json file not found"
            })))
        }
    }
}
