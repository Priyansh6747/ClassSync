mod parser;

use axum::{response::Html, routing::{get, post}, Json, Router};
use tokio;
use serde::{Deserialize, Serialize};

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
    // Build our app: Combine GET and POST on "/"
    let app = Router::new()
        .route("/", get(hello_world).post(new))
        .route("/new", get(try_json))
        .route("/submit", post(handle_post));

    // Start listening on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server running on http://localhost:3000");

    axum::serve(listener, app).await.unwrap();
}

// GET handler
async fn hello_world() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1>")
}

// POST handler
async fn new() -> Html<&'static str> {
    Html("<h1>New, World!</h1>")
}

async fn try_json() -> Json<Message> {
    let response = Message {
        msg: "Hello, JSON World!".to_string(),
    };
    Json(response)
}
async fn handle_post(Json(payload): Json<Input>) -> Json<Message> {
    let response = Message {
        msg: format!("Hello, {}!", payload.name),
    };
    Json(response)
}