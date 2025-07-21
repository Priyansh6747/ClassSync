mod parser;
mod models;
mod test;
mod db;

use axum::{response::Html, routing::{get, post}, Json, Router};
use tower_http::cors::{CorsLayer, Any};
use tokio;
use serde::{Deserialize, Serialize};
use crate::models::meta_data::{TimeTableMetaData,TimeTableInfo};

#[derive(Serialize)]
struct Message {
    msg: String,
}

#[derive(Deserialize)]
struct Input {
    name: String,
}

#[tokio::main]
async fn main() {
    // Create CORS layer
    let cors = CorsLayer::new()
        .allow_origin(Any) 
        .allow_methods(Any) 
        .allow_headers(Any); 

   
    let app = Router::new()
        .route("/new", get(try_json))
        .route("/metadata", post(get_metadata))
        .layer(cors); 

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server running on http://localhost:3000");

    axum::serve(listener, app).await.unwrap();
}

async fn try_json() -> Json<Message> {
    let response = Message {
        msg: "Hello, JSON World!".to_string(),
    };
    Json(response)
}

async fn get_metadata(Json(payload): Json<TimeTableInfo>) -> Json<TimeTableMetaData> {
    let res = payload.transform();
    Json(res)
}