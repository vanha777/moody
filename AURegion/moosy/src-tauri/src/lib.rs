use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{FromRow, PgPool};
use std::sync::OnceLock;
use tauri::{Emitter, Manager, State};
// Define the authentication data structure that matches the TypeScript interface
#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct AuthData {
    // Never serialized.
    // #[serde(skip_serializing)]
    pub username: String,
    // Never serialized.
    // #[serde(skip_serializing)]
    pub password: String,
    pub roles: Roles,
    pub company: Company,
    pub bookings: Option<Vec<Booking>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Roles {
    pub owner: Vec<Person>,
    pub admin: Option<Vec<Person>>,
    pub staff: Option<Vec<Person>>,
    pub customer: Option<Vec<Customer>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Person {
    pub id: String,
    pub personal_information: PersonalInfo,
    pub profile_image: Option<Image>,
    pub contact_method: Option<Vec<ContactMethod>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Customer {
    pub id: String,
    pub personal_information: PersonalInfo,
    pub notes: Option<String>,
    pub profile_image: Option<Image>,
    pub contact_method: Option<Vec<ContactMethod>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct PersonalInfo {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: Option<String>,
    pub gender: Option<String>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Image {
    pub id: String,
    pub r#type: Option<String>,
    pub path: Option<String>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct ContactMethod {
    pub id: String,
    pub r#type: String,
    pub value: String,
    pub is_primary: bool,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Company {
    pub id: String,
    pub name: String,
    pub description: String,
    pub logo: Option<Image>,
    pub currency: Currency,
    pub timetable: Vec<Timetable>,
    pub services_by_catalogue: Option<Vec<ServiceCatalogue>>,
    pub contact_method: Option<Vec<ContactMethod>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Currency {
    pub id: String,
    pub code: String,
    pub symbol: String,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Timetable {
    pub id: String,
    pub company_id: String,
    pub day_of_week: i32,
    pub start_time: String,
    pub end_time: String,
    pub timezone: String,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct ServiceCatalogue {
    pub catalogue: Option<Catalogue>,
    pub services: Option<Vec<Service>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Catalogue {
    pub id: String,
    pub name: String,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Service {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub duration: String,
    pub price: f64,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct BookingResponse {
    pub booking: Booking,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Booking {
    pub id: String,
    pub customer: Customer,
    pub staff: Option<Person>,
    pub service: Service,
    pub status: Status,
    pub start_time: String,
    pub end_time: String,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Status {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub created_at: String,
}

// Define a static DATABASE_URL that will be initialized once
static DATABASE_URL: OnceLock<String> = OnceLock::new();

// Helper function to get or initialize the DATABASE_URL
fn get_database_url() -> &'static str {
    DATABASE_URL
        .get_or_init(|| dotenv::var("DATABASE_URL").unwrap_or_else(|_| "postgres".to_string()))
}

#[tauri::command]
async fn login(
    pool: State<'_, PgPool>,
    username: String,
    password: String,
    app: tauri::AppHandle,
    refresh: bool,
) -> Result<AuthData, String> {
    println!("username: {}", username);

    // Create SHA256 hash of the password
    let mut hasher = Sha256::new();
    let password_hash = match refresh {
        true => password,
        false => {
            hasher.update(password.as_bytes());
            hex::encode(hasher.finalize())
        }
    };

    println!(
        "Attempting login with username: {} and password hash: {}",
        username, password_hash
    );

    // send request to edge function get token

    // Get the result as JSON Value instead of trying to directly map to AuthData
    let result: Option<Value> =
        sqlx::query_scalar("SELECT public.get_company_details_by_owner($1, $2)")
            .bind(&username)
            .bind(&password_hash)
            .fetch_one(&*pool)
            .await
            .map_err(|e| {
                println!("Database error: {}", e.to_string());
                format!("Database error: {}", e.to_string())
            })?;

    // Check if we got a NULL result or no result at all
    if result.is_none() {
        println!("Invalid username or password");
        return Err("Invalid username or password".to_string());
    }

    // Deserialize the JSON value into AuthData
    let auth_data: AuthData = serde_json::from_value(result.unwrap()).map_err(|e| {
        println!("Failed to parse authentication data: {}", e);
        format!("Failed to parse authentication data: {}", e)
    })?;

    // Save the authentication info after successful login
    let _ = save_auth(app, auth_data.clone())?;

    // Return the result
    Ok(auth_data)
}

#[tauri::command]
fn save_auth(app: tauri::AppHandle, data: AuthData) -> Result<(), String> {
    let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    // Create the directory if it doesn't exist
    std::fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;

    let path = app_data_dir.join("auth.json");

    // Serialize the AuthData struct to a formatted JSON string
    let formatted_json = serde_json::to_string_pretty(&data)
        .map_err(|e| format!("Failed to serialize auth data: {}", e))?;

    // Write the formatted JSON to the file
    let _ = std::fs::write(path, formatted_json)
        .map_err(|e| format!("Failed to write auth file: {}", e))?;

    // Initialize state with existing auth data
    app.manage(AuthState(Some(data.clone())));

    // Emit an event to notify the frontend
    app.emit("state-updated", data)
        .map_err(|e| format!("Failed to emit event: {}", e))?;

    Ok(())
}

#[tauri::command]
fn read_auth(app: tauri::AppHandle) -> Result<AuthData, String> {
    let path = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("auth.json");

    // Check if the file exists
    if !path.exists() {
        return Err("No authentication data found".to_string());
    }

    // Read the file content
    let file_content = std::fs::read_to_string(path)
        .map_err(|e: std::io::Error| format!("Failed to read auth file: {}", e))?;

    // Parse the JSON string into AuthData struct
    let auth_data: AuthData = serde_json::from_str(&file_content)
        .map_err(|e| format!("Failed to parse auth data: {}", e))?;

    Ok(auth_data)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize notification plugin
            // app.handle().plugin(tauri_plugin_notification::init())?;
            let pool = tauri::async_runtime::block_on(async {
                sqlx::postgres::PgPoolOptions::new()
                    .max_connections(2)
                    .connect("postgres:")
                    .await
                    .expect("Failed to create pool")
            });

            app.manage(pool.clone());

            // Read authentication data and store it in app state for later use
            let app_handle: &tauri::AppHandle = app.handle();
            match read_auth(app_handle.clone()) {
                Ok(auth_data) => {
                    let _ = tauri::async_runtime::block_on(async {
                        // Get the result as JSON Value instead of trying to directly map to AuthData
                        let result: Option<Value> = sqlx::query_scalar(
                            "SELECT public.get_company_details_by_owner($1, $2)",
                        )
                        .bind(&auth_data.username)
                        .bind(&auth_data.password)
                        .fetch_one(&pool)
                        .await
                        .map_err(|e| {
                            println!("Database error when setup: {}", e.to_string());
                            format!("Database error when setup: {}", e.to_string())
                        })?;

                        // Check if we got a NULL result or no result at all
                        if result.is_none() {
                            println!("Invalid username or password when setup");
                            return Err("Invalid username or password when setup".to_string());
                        }

                        // Deserialize the JSON value into AuthData
                        let new_auth_data: AuthData = serde_json::from_value(result.unwrap())
                            .map_err(|e| {
                                println!("Failed to parse authentication data when setup: {}", e);
                                format!("Failed to parse authentication data when setup: {}", e)
                            })?;

                        let app_data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

                        // Create the directory if it doesn't exist
                        std::fs::create_dir_all(&app_data_dir).map_err(|e| {
                            format!("Failed to create app data directory when setup: {}", e)
                        })?;

                        let path = app_data_dir.join("auth.json");

                        // Serialize the AuthData struct to a formatted JSON string
                        let formatted_json =
                            serde_json::to_string_pretty(&new_auth_data).map_err(|e| {
                                format!("Failed to serialize auth data when setup: {}", e)
                            })?;

                        // Write the formatted JSON to the file
                        let _ = std::fs::write(path, formatted_json)
                            .map_err(|e| format!("Failed to write auth file when setup: {}", e))?;

                        // Initialize state with existing auth data
                        app.manage(AuthState(Some(new_auth_data.clone())));

                        app.emit("state-updated", new_auth_data)
                            .map_err(|e| format!("Failed to emit event: {}", e))?;
                        Ok(())
                    })?;
                }
                Err(e) => {
                    eprintln!("Error reading auth data when setup: {}", e);
                    app.manage(AuthState(None));
                }
            };

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            login,
            save_auth,
            read_auth,
            get_auth_state,
            fetch_latest_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Add this struct to store auth state in the app
#[derive(Clone)]
struct AuthState(Option<AuthData>);

// Add command to retrieve auth state from frontend
#[tauri::command]
fn get_auth_state(state: State<'_, AuthState>) -> Result<AuthData, String> {
    match state.0.clone() {
        Some(auth_data) => Ok(auth_data),
        None => Err("Not authenticated".to_string()),
    }
}

#[tauri::command]
async fn fetch_latest_state(
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<String, String> {
    // Get the current auth data
    let auth_data = match &state.0 {
        Some(data) => data.clone(),
        None => return Err("Not authenticated".to_string()),
    };
    // Reuse login with existing credentials to get fresh state
    let username = auth_data.username.clone();
    let password = auth_data.password.clone();

    // Call login function to refresh auth data
    let _ = login(pool, username, password, app, true).await?;

    // // Update the application state
    // app.manage(AuthState(Some(new_auth_data)));

    // Return the updated auth data
    Ok("200".to_string())
}
