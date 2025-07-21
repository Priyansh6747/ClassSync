mod parser;
mod models;
mod test;
mod db;

use axum::{response::Html, routing::{get, post}, Json, Router};
use axum::http::StatusCode;
use tower_http::cors::{CorsLayer, Any};
use tokio;
use serde::{Deserialize, Serialize};
use crate::db::config::MongoConnection;
use crate::models::meta_data::{TimeTableMetaData, TimeTableInfo};
use crate::models::wrapper::MetaData;

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
        .route("/metadata", post(set_metadata))
        .route("/metadata", get(get_metadata))
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

async fn set_metadata(Json(payload): Json<TimeTableInfo>) -> Json<Message> {
    println!("Got metadata: ");
    let res = payload.transform();
    let mongo = MongoConnection::new().await;
    match mongo {
        Ok(connection) => {
            let _= connection.add_meta_data("class_sync", res).await;
            Json(Message{msg: "Success".to_string()})
        }
        Err(e) => { return Json(Message { msg: format!("Mongo error: {}", e) }) }
    }
}

async fn get_metadata() -> Result<Json<MetaData>, (StatusCode, Json<Message>)> {
    let mongo = MongoConnection::new().await;
    match mongo {
        Ok(connection) => {
            match connection.get_metadata("class_sync").await {
                Ok(meta_data) => {Ok(Json(meta_data))}
                Err(e) => {Err((StatusCode::NOT_FOUND, Json(Message{msg: format!("Mongo error: {}", e)})))}
            }
            
        }
        Err(e) => {
            Err((StatusCode::INTERNAL_SERVER_ERROR, Json(Message{msg: format!("Mongo error: {}", e)})))
        }
    }
}