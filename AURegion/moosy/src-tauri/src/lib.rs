use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{FromRow, PgPool};
use tauri::{Emitter, Manager, State};
use sqlx::types::Uuid; // Add this dependency for UUID handling
use std::sync::OnceLock;
                // Define the authentication data structure that matches the TypeScript interface
#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct AuthData {
    pub roles: Roles,
    pub company: Company,
    pub bookings: Option<Vec<Booking>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Roles {
    pub owner: Vec<Person>,
    pub admin: Option<Vec<Person>>,
    pub staff: Option<Vec<Person>>,
    pub customer: Option<Vec<Customer>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Person {
    pub id: String,
    pub personal_information: PersonalInfo,
    pub profile_image: Option<Image>,
    pub contact_method: Option<Vec<ContactMethod>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Customer {
    pub id: String,
    pub personal_information: PersonalInfo,
    pub notes: Option<String>,
    pub profile_image: Option<Image>,
    pub contact_method: Option<Vec<ContactMethod>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct PersonalInfo {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: Option<String>,
    pub gender: Option<String>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Image {
    pub id: String,
    pub r#type: Option<String>,
    pub path: Option<String>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct ContactMethod {
    pub id: String,
    pub r#type: String,
    pub value: String,
    pub is_primary: bool,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
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

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Currency {
    pub id: String,
    pub code: String,
    pub symbol: String,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Timetable {
    pub id: String,
    pub company_id: String,
    pub day_of_week: i32,
    pub start_time: String,
    pub end_time: String,
    pub timezone: String,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct ServiceCatalogue {
    pub catalogue: Option<Catalogue>,
    pub services: Option<Vec<Service>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Catalogue {
    pub id: String,
    pub name: String,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Service {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub duration: String,
    pub price: f64,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct BookingResponse {
    pub booking: Booking,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Booking {
    pub id: String,
    pub customer: Customer,
    pub staff: Option<Person>,
    pub service: Service,
    pub status: Status,
    pub start_time: String,
    pub end_time: String,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
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
    DATABASE_URL.get_or_init(|| {
        dotenv::var("DATABASE_URL").unwrap_or_else(|_| {
            "postgres://".to_string()
        })
    })
}

#[tauri::command]
async fn login(
    pool: State<'_, PgPool>,
    username: String,
    password: String,
    app: tauri::AppHandle,
) -> Result<AuthData, String> {
    println!("username: {}", username);

    // Create SHA256 hash of the password
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let password_hash = hex::encode(hasher.finalize());

    println!(
        "Attempting login with username: {} and password hash: {}",
        username, password_hash
    );

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
    save_auth(app, auth_data.clone())?;

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
    std::fs::write(path, formatted_json)
        .map_err(|e| format!("Failed to write auth file: {}", e))?;

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
            let pool = tauri::async_runtime::block_on(async {
                sqlx::postgres::PgPoolOptions::new()
                    .max_connections(2) // Reduced for mobile
                    .connect(get_database_url())
                    .await
                    .expect("Failed to create pool")
            });

            app.manage(pool);

            // Read authentication data and store it in app state for later use
            let app_handle: &tauri::AppHandle = app.handle();
            match read_auth(app_handle.clone()) {
                Ok(auth_data) => {
                    // Store auth data in app state for later retrieval
                    app.manage(AuthState(Some(auth_data)));
                }
                Err(e) => {
                    eprintln!("Error reading auth data: {}", e);
                    // Still initialize with empty to avoid crashes
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
            update_booking
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
async fn update_booking(
    booking_id: String,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<String, String> {
    // Get the current auth data
    let mut auth_data = match &state.0 {
        Some(data) => data.clone(),
        None => return Err("Not authenticated".to_string()),
    };
    // Query database for the updated booking information
    // The issue might be that we need to call the function directly rather than using SELECT
    // Also, using query_as instead of query_scalar to handle the JSON return type properly
    println!("booking_id: {}", booking_id);
    println!("company_id: {}", auth_data.company.id);
    // let result: Option<Value> = sqlx::query_scalar("SELECT * FROM public.get_booking_details($1, $2)")
    //     .bind(&booking_id)
    //     .bind(&auth_data.company.id)
    //     .fetch_one(&*pool)
    //     .await
    //     .map_err(|e| {
    //         println!("Database error when fetching booking: {}", e.to_string());
    //         format!("Database error when fetching booking: {}", e.to_string())
    //     })?;

    let booking_id_uuid =
        Uuid::parse_str(&booking_id).map_err(|e| format!("Invalid booking ID: {}", e))?;
    let company_id_uuid =
        Uuid::parse_str(&auth_data.company.id).map_err(|e| format!("Invalid company ID: {}", e))?;
    let result = sqlx::query_scalar::<_, Value>("SELECT public.get_booking_details($1, $2)")
        .bind(booking_id_uuid)
        .bind(company_id_uuid)
        .fetch_one(&*pool)
        .await
        .map_err(|e| {
            println!("Database error when fetching booking: {}", e);
            format!("Database error when fetching booking: {}", e)
        })?;

    // Check if we got a result
    if result.is_null() {
        println!("Booking not found");
        return Err("Booking not found".to_string());
    }
    // Parse the booking from the database result
    let booking: BookingResponse = serde_json::from_value(result).map_err(|e| {
        println!("Failed to parse booking data: {}", e);
        format!("Failed to parse booking data: {}", e)
    })?;

    // Update the bookings in the auth data
    let bookings = auth_data.bookings.get_or_insert_with(Vec::new);

    // Find and update the existing booking or add a new one
    let mut found = false;
    for i in 0..bookings.len() {
        if bookings[i].id == booking_id {
            println!("booking found");
            bookings[i] = booking.booking.clone();
            found = true;
            break;
        }
    }

    if !found {
        println!("booking not found, adding to bookings");
        bookings.push(booking.booking);
    }

    // Save the updated auth data
    save_auth(app.clone(), auth_data.clone())?;

    // Update the application state
    app.manage(AuthState(Some(auth_data.clone())));

    // Emit an event to notify the frontend
    app.emit("state-updated", true)
        .map_err(|e| format!("Failed to emit event: {}", e))?;

    // Return the updated auth data
    Ok("200".to_string())
}
