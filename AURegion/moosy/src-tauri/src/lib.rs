use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{FromRow, PgPool};
use tauri::{Manager, State};
// Define the authentication data structure that matches the TypeScript interface
#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct AuthData {
    pub roles: Roles,
    pub company: Company,
    pub bookings: Vec<Booking>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone)]
pub struct Roles {
    pub owner: Vec<Person>,
    pub admin: Vec<Person>,
    pub staff: Vec<Person>,
    pub customer: Vec<Customer>,
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
    pub logo: Image,
    pub currency: Currency,
    pub timetable: Vec<Timetable>,
    pub services_by_catalogue: Vec<ServiceCatalogue>,
    pub contact_method: Vec<ContactMethod>,
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
    pub catalogue: Catalogue,
    pub services: Vec<Service>,
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

    println!("Attempting login with password hash: {}", password_hash);
    
    // Get the result as JSON Value instead of trying to directly map to AuthData
    let result: Value = sqlx::query_scalar("SELECT public.get_company_details_by_owner($1, $2)")
        .bind(&username)
        .bind(&password_hash)
        .fetch_one(&*pool)
        .await
        .map_err(|e| format!("Database error: {}", e.to_string()))?;

    // Check if we got a NULL result or no result at all
    if result.is_null() {
        return Err("Invalid username or password".to_string());
    }

    // Deserialize the JSON value into AuthData
    let auth_data: AuthData = serde_json::from_value(result)
        .map_err(|e| format!("Failed to parse authentication data: {}", e))?;

    // Save the authentication info after successful login
    save_auth(app, auth_data.clone())?;

    // Return the result
    Ok(auth_data)
}

#[tauri::command]
fn save_auth(app: tauri::AppHandle, data: AuthData) -> Result<(), String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    
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
    let file_content =
        std::fs::read_to_string(path).map_err(|e| format!("Failed to read auth file: {}", e))?;

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
                    .connect(&dotenv::var("DATABASE_URL").expect("DATABASE_URL must be set"))
                    .await
                    .expect("Failed to create pool")
            });

            app.manage(pool);

            // Read authentication data and store it in app state for later use
            let app_handle = app.handle();
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
            get_auth_state
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
