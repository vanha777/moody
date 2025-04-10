use futures::future::try_join_all;
use reqwest::Client;
use serde::Serialize;
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use sqlx::{FromRow, PgPool};
use std::{collections::HashMap, sync::OnceLock};
use tauri::{http::header::PROXY_AUTHENTICATE, Emitter, Manager, State};
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
    pub address: Option<Address>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Auxiliary {
    pub name: Option<String>,
    pub value: Option<f64>,
    pub description: Option<String>,
    pub r#type: Option<String>,
    pub increment: Option<bool>,
    pub decrement: Option<bool>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Person {
    pub id: String,
    pub personal_information: PersonalInfo,
    pub profile_image: Option<Image>,
    pub contact_method: Option<Vec<ContactMethod>>,
    pub address: Option<Address>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Customer {
    pub id: String,
    pub personal_information: PersonalInfo,
    pub notes: Option<String>,
    pub profile_image: Option<Image>,
    pub contact_method: Option<Vec<ContactMethod>>,
    pub address: Option<Address>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Address {
    pub street: Option<String>,
    pub city: Option<String>,
    pub state: Option<String>,
    pub postal_code: Option<String>,
    pub country: Option<String>,
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
    pub profile: Option<Image>,
    pub currency: Currency,
    pub timetable: Vec<Timetable>,
    pub services_by_catalogue: Option<Vec<ServiceCatalogue>>,
    pub contact_method: Option<Vec<ContactMethod>>,
    pub campaigns: Option<HashMap<String, Vec<Campaign>>>,
    pub financial: Option<Financial>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Financial {
    pub daily: DailyData,
    pub weekly: PeriodData,
    pub monthly: PeriodData,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct DailyData {
    pub total_revenue: f64,
    pub total_count: i32,
    pub most_used_payment_method: Option<String>,
    pub most_used_service: Option<String>,
    pub new_customer: Option<i32>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct PeriodData {
    pub total_revenue: f64,
    pub total_count: i32,
    pub breakdown: Option<Vec<BreakdownData>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct BreakdownData {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub date_full: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub month: Option<String>,
    pub total_revenue: f64,
    pub total_count: i32,
    pub most_used_payment_method: Option<String>,
    pub most_used_service: Option<String>,
    pub new_customer: i32,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Campaign {
    pub id: String,
    pub name: String,
    pub description: String,
    pub trigger_frequency: i32,
    pub message_template: String,
    pub active: bool,
    pub r#type: String,
    pub features: Option<Vec<Feature>>,
}

#[derive(FromRow, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Feature {
    pub feature_id: String,
    pub feature_name: String,
    pub feature_description: String,
    pub feature_cap: i32,
    pub usage: i32,
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
    pub services: Option<Vec<Service>>,
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
    DATABASE_URL.get_or_init(|| dotenv::var("DATABASE_URL").unwrap_or_else(|_| "post".to_string()))
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
            let pool: sqlx::Pool<sqlx::Postgres> = tauri::async_runtime::block_on(async {
                sqlx::postgres::PgPoolOptions::new()
                    .max_connections(2)
                    .connect("")
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
            fetch_latest_state,
            cancel_booking,
            reschedule_booking,
            checkout_booking,
            add_customer,
            edit_customer,
            delete_customer,
            checkout_walkin,
            update_campaign,
            send_email,
            add_booking
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

#[tauri::command]
async fn cancel_booking(
    booking_id: String,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<String, String> {
    // Get the current auth data to ensure user is authenticated
    let _ = match &state.0 {
        Some(data) => data.clone(),
        None => return Err("Not authenticated".to_string()),
    };

    // Execute SQL query to update the booking status
    // Convert the booking_id string to UUID since the database expects UUID type
    let status_id = "e11e739f-44a8-4b2a-958d-c4d5ad73db88";

    match sqlx::query("UPDATE booking SET status_id = $1::uuid WHERE id = $2::uuid")
        .bind(status_id)
        .bind(booking_id.clone())
        .execute(&*pool)
        .await
    {
        Ok(result) => {
            if result.rows_affected() == 0 {
                return Err(format!("No booking found with ID: {}", booking_id));
            }

            // Fetch the latest state to ensure the app has up-to-date data
            let _ = fetch_latest_state(pool, state, app).await?;

            Ok(format!("Booking {} successfully cancelled", booking_id))
        }
        Err(e) => Err(format!("Failed to cancel booking: {}", e)),
    }
}

#[tauri::command]
async fn reschedule_booking(
    booking_id: String,
    new_date: String,
    end_time: String,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<String, String> {
    // Get the current auth data to ensure user is authenticated
    let _ = match &state.0 {
        Some(data) => data.clone(),
        None => return Err("Not authenticated".to_string()),
    };

    // Execute SQL query to update the booking status
    // Convert the booking_id string to UUID since the database expects UUID type
    let status_id = "e11e739f-44a8-4b2a-958d-c4d5ad73db88";

    match sqlx::query("UPDATE booking SET start_time = $1::timestamp, end_time = $2::timestamp WHERE id = $3::uuid")
        .bind(new_date)
        .bind(end_time)
        .bind(booking_id.clone())
        .execute(&*pool)
        .await
    {
        Ok(result) => {
            if result.rows_affected() == 0 {
                return Err(format!("No booking found with ID: {}", booking_id));
            }

            // Fetch the latest state to ensure the app has up-to-date data
            let _ = fetch_latest_state(pool, state, app).await?;

            Ok(format!("Booking {} successfully rescheduled", booking_id))
        }
        Err(e) => Err(format!("Failed to reschedule booking: {}", e)),
    }
}

#[tauri::command]
async fn checkout_booking(
    booking_id: Option<String>,
    customer_id: String,
    services_id: Option<Vec<String>>,
    discounts_id: Option<Vec<String>>,
    auxiliary: Option<Vec<Auxiliary>>,
    currency_id: String,
    method: String,
    amount: f64,
    status: String,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<sqlx::types::Uuid, String> {
    // Get the current auth data to ensure user is authenticated
    let data = match &state.0 {
        Some(data) => data.clone(),
        None => return Err("Not authenticated".to_string()),
    };

    let payment_result = sqlx::query_as::<_, (sqlx::types::Uuid,)>(
        "INSERT INTO public.payments (amount, currency_id, payment_method, person_id, company_id, status) 
         VALUES ($1, $2::uuid, $3, $4::uuid, $5::uuid, $6)
         RETURNING id"
    )
    .bind(amount)
    .bind(currency_id)
    .bind(method)
    .bind(customer_id)
    .bind(data.company.id)  // Use company ID from auth data directly
    .bind(status)
    .fetch_one(&*pool)
    .await
    .map_err(|e| format!("Failed to process payment: {}", e))?.0;

    // update booking status & link booking to payment
    match booking_id {
        Some(id) => {
            let id = id.clone();
            // Update booking status
            sqlx::query("UPDATE booking SET status_id = $1::uuid WHERE id = $2::uuid")
                .bind("0758ec7a-8cf6-4247-923c-cdbdfeb214db") // completed status id
                .bind(id.clone())
                .execute(&*pool)
                .await
                .map_err(|e| format!("Failed to update booking status: {}", e))?;

            // Link booking to payment
            let payment_id = payment_result.to_string();
            let pool = pool.clone();
            sqlx::query("INSERT INTO public.payment_linkable (payment_id, linkable_id, linkable_type) VALUES ($1::uuid, $2::uuid, $3)")
                .bind(payment_id)
                .bind(id)
                .bind("booking")
                .execute(&*pool)
                .await
                .map_err(|e| format!("Failed to link booking to payment: {}", e))?;
        }
        None => (),
    };

    // link services to payment
    match services_id {
        Some(ids) => {
            let payment_id = payment_result.to_string();
            let futures = ids.iter().map(|id| {
                let pool = pool.clone();
                let payment_id = payment_id.clone();
                let id = id.clone();
                async move {
                    sqlx::query("INSERT INTO public.payment_linkable (payment_id, linkable_id, linkable_type) VALUES ($1::uuid, $2::uuid, $3)")
                        .bind(payment_id)
                        .bind(id)
                        .bind("services")
                        .execute(&*pool)
                        .await
                        .map_err(|e| format!("Failed to link service to payment: {}", e))
                }
            });
            try_join_all(futures).await?;
        }
        None => (),
    };

    // link discounts to payment
    match discounts_id {
        Some(ids) => {
            let payment_id = payment_result.to_string();
            let futures = ids.iter().map(|id| {
                let pool = pool.clone();
                let payment_id = payment_id.clone();
                let id = id.clone();
                async move {
                    sqlx::query("INSERT INTO public.payment_linkable (payment_id, linkable_id, linkable_type) VALUES ($1::uuid, $2::uuid, $3)")
                        .bind(payment_id)
                        .bind(id)
                        .bind("discounts")
                        .execute(&*pool)
                        .await
                        .map_err(|e| format!("Failed to link discount to payment: {}", e))
                }
            });
            try_join_all(futures).await?;
        }
        None => (),
    };

    // link auxiliary to payment
    match auxiliary {
        Some(ids) => {
            let payment_id = payment_result.to_string();
            let futures = ids.iter().map(|id| {
                    let pool = pool.clone();
                    let payment_id = payment_id.clone();
                    let id = id.clone();
                    async move {
                        // Insert into auxiliary table and get the ID
                        let aux_id: Option<sqlx::types::Uuid> = sqlx::query_scalar(
                            "INSERT INTO public.auxiliary (name, value, description, type, increment, decrement) 
                             VALUES ($1, $2::numeric, $3, $4, $5::boolean, $6::boolean) 
                             RETURNING id"
                        )
                            .bind(id.name)
                            .bind(id.value)
                            .bind(id.description)
                            .bind(id.r#type)
                            .bind(id.increment)
                            .bind(id.decrement)
                            .fetch_one(&*pool)
                            .await
                            .map_err(|e| format!("Failed to insert auxiliary: {}", e))?;
                        
                        // Link the auxiliary to the payment
                        if let Some(aux_id) = aux_id {
                            sqlx::query(
                                "INSERT INTO public.payment_linkable (payment_id, linkable_id, linkable_type) 
                                 VALUES ($1::uuid, $2::uuid, $3)"
                            )
                                .bind(payment_id)
                                .bind(aux_id)
                                .bind("auxiliary")
                                .execute(&*pool)
                                .await
                                .map_err(|e| format!("Failed to link auxiliary to payment: {}", e))?;
                        }
                        Ok(()) as Result<(), String>
                    }
                });
            try_join_all(futures).await?;
        }
        None => (),
    };

    let _ = fetch_latest_state(pool, state, app).await?;
    Ok(payment_result) // Return the UUID from the tuple
}

// First, define the struct for the customer input
#[derive(serde::Deserialize, Clone, Serialize)]
struct CustomerInput {
    id: Option<String>,
    avatar: Option<String>,
    phone: String,
    #[serde(rename = "firstName")]
    first_name: String,
    #[serde(rename = "lastName")]
    last_name: String,
    date_of_birth: Option<String>,
    gender: Option<String>,
    email: Option<String>,
    notes: Option<String>,
    address: Option<Address>,
}

#[tauri::command]
async fn add_customer(
    customer: CustomerInput,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<serde_json::Value, String> {
    // Get the current auth data to ensure user is authenticated
    let auth = match &state.0 {
        Some(data) => data.clone(),
        None => return Err("Not authenticated".to_string()),
    };

    // Execute the create_or_update_customer function
    let result: Option<sqlx::types::Uuid> = sqlx::query_scalar(
        "SELECT public.create_or_update_customer($1, $2::uuid, $3, $4, $5::date, $6, $7, $8, $9, $10, $11, $12, $13)"
    )
    .bind(&customer.phone)
    .bind(&auth.company.id)
    .bind(&customer.first_name)
    .bind(&customer.last_name)
    .bind(customer.date_of_birth)
    .bind(customer.gender)
    .bind(customer.email.as_ref().map(|x|x.clone()))
    .bind(customer.address.as_ref().map(|a| a.street.clone()))
    .bind(customer.address.as_ref().map(|a| a.city.clone()))
    .bind(customer.address.as_ref().map(|a| a.state.clone()))
    .bind(customer.address.as_ref().map(|a| a.postal_code.clone()))  // This is p_postal_code in the SQL function
    .bind(customer.address.as_ref().map(|a| a.country.clone()))
    .bind(customer.notes)  // This is p_note in the SQL function
        .fetch_one(&*pool)
        .await
        .map_err(|e| format!("Failed to create/update customer: {}", e))?;

    match result {
        Some(customer_id) => {
            let _ = fetch_latest_state(pool, state, app).await?;
            Ok(json!({
                "id": customer_id.to_string(),
                "name": format!("{} {}", customer.first_name.clone(), customer.last_name.clone()),
                "firstName": customer.first_name.clone(),
                "lastName": customer.last_name.clone(),
                "email": customer.email.map(|x|x.clone()),
                "phone": customer.phone,
                "address": customer.address.map(|x|x.clone()),
            }
            ))
        }
        None => Err("Failed to create/update customer".to_string()),
    }
}

#[tauri::command]
async fn edit_customer(
    customer: CustomerInput,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<sqlx::types::Uuid, String> {
    // Get the current auth data to ensure user is authenticated
    let auth = match &state.0 {
        Some(data) => data.clone(),
        None => return Err("Not authenticated".to_string()),
    };

    // Execute the update_person_by_id function
    let result: Option<sqlx::types::Uuid> = sqlx::query_scalar(
        "SELECT public.update_person_by_id($1::uuid, $2, $3, $4::date, $5, $6, $7, $8, $9, $10, $11, $12)"
    )
        .bind(&customer.id)
        .bind(&customer.first_name)
        .bind(&customer.last_name)
        .bind(&customer.date_of_birth)
        .bind(&customer.gender)
        .bind(&customer.email)
        .bind(customer.address.as_ref().map(|a| a.street.clone()))
        .bind(customer.address.as_ref().map(|a| a.city.clone()))
        .bind(customer.address.as_ref().map(|a| a.state.clone()))
        .bind(customer.address.as_ref().map(|a| a.postal_code.clone()))  // This is p_postal_code in the SQL function
        .bind(customer.address.as_ref().map(|a| a.country.clone()))
        .bind(&customer.notes)  // This is p_note in the SQL function
        .fetch_one(&*pool)
        .await
        .map_err(|e| format!("Failed to update customer: {}", e))?;

    match result {
        Some(customer_id) => {
            let _ = fetch_latest_state(pool, state, app).await?;
            Ok(customer_id)
        }
        None => Err("Failed to create/update customer".to_string()),
    }
}

#[tauri::command]
async fn delete_customer(
    customer_id: String,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<sqlx::types::Uuid, String> {
    // Get the current auth data to ensure user is authenticated
    let auth = match &state.0 {
        Some(data) => data.clone(),
        None => return Err("Not authenticated".to_string()),
    };

    // Parse the customer_id string into a UUID
    let customer_uuid = sqlx::types::Uuid::parse_str(&customer_id)
        .map_err(|e| format!("Invalid customer ID format: {}", e))?;

    // Execute the delete operation
    let result = sqlx::query!(
        "DELETE FROM people WHERE id = $1 RETURNING id",
        customer_uuid
    )
    .fetch_optional(&*pool)
    .await
    .map_err(|e| format!("Failed to delete customer: {}", e))?;

    match result {
        Some(record) => {
            let _ = fetch_latest_state(pool, state, app).await?;
            Ok(record.id)
        }
        None => Err("Customer not found".to_string()),
    }
}

#[tauri::command]
async fn checkout_walkin(
    customer_id: Option<String>,
    services_id: Option<Vec<String>>,
    discounts_id: Option<Vec<String>>,
    auxiliary: Option<Vec<Auxiliary>>,
    currency_id: String,
    method: String,
    amount: f64,
    status: String,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<sqlx::types::Uuid, String> {
    // Get the current auth data to ensure user is authenticated
    let data = match &state.0 {
        Some(data) => data.clone(),
        None => return Err("Not authenticated".to_string()),
    };

    let payment_result = sqlx::query_as::<_, (sqlx::types::Uuid,)>(
        "INSERT INTO public.payments (amount, currency_id, payment_method, person_id, company_id, status) 
         VALUES ($1, $2::uuid, $3, $4::uuid, $5::uuid, $6)
         RETURNING id"
    )
    .bind(amount)
    .bind(currency_id)
    .bind(method)
    .bind(customer_id)
    .bind(data.company.id)  // Use company ID from auth data directly
    .bind(status)
    .fetch_one(&*pool)
    .await
    .map_err(|e| format!("Failed to process payment: {}", e))?.0;

    // update booking status & link booking to payment
    // match booking_id {
    //     Some(id) => {
    //         let id = id.clone();
    //         // Update booking status
    //         sqlx::query("UPDATE booking SET status_id = $1::uuid WHERE id = $2::uuid")
    //             .bind("0758ec7a-8cf6-4247-923c-cdbdfeb214db") // completed status id
    //             .bind(id.clone())
    //             .execute(&*pool)
    //             .await
    //             .map_err(|e| format!("Failed to update booking status: {}", e))?;

    //         // Link booking to payment
    //         let payment_id = payment_result.to_string();
    //         let pool = pool.clone();
    //         sqlx::query("INSERT INTO public.payment_linkable (payment_id, linkable_id, linkable_type) VALUES ($1::uuid, $2::uuid, $3)")
    //             .bind(payment_id)
    //             .bind(id)
    //             .bind("booking")
    //             .execute(&*pool)
    //             .await
    //             .map_err(|e| format!("Failed to link booking to payment: {}", e))?;
    //     }
    //     None => (),
    // };

    //  link services to payment
    match services_id {
        Some(ids) => {
            let payment_id = payment_result.to_string();
            let futures = ids.iter().map(|id| {
                let pool = pool.clone();
                let payment_id = payment_id.clone();
                let id = id.clone();
                async move {
                    sqlx::query("INSERT INTO public.payment_linkable (payment_id, linkable_id, linkable_type) VALUES ($1::uuid, $2::uuid, $3)")
                        .bind(payment_id)
                        .bind(id)
                        .bind("services")
                        .execute(&*pool)
                        .await
                        .map_err(|e| format!("Failed to link service to payment: {}", e))
                }
            });
            try_join_all(futures).await?;
        }
        None => (),
    };

    // link discounts to payment
    match discounts_id {
        Some(ids) => {
            let payment_id = payment_result.to_string();
            let futures = ids.iter().map(|id| {
                let pool = pool.clone();
                let payment_id = payment_id.clone();
                let id = id.clone();
                async move {
                    sqlx::query("INSERT INTO public.payment_linkable (payment_id, linkable_id, linkable_type) VALUES ($1::uuid, $2::uuid, $3)")
                        .bind(payment_id)
                        .bind(id)
                        .bind("discounts")
                        .execute(&*pool)
                        .await
                        .map_err(|e| format!("Failed to link discount to payment: {}", e))
                }
            });
            try_join_all(futures).await?;
        }
        None => (),
    };   
    
     // link auxiliary to payment
    match auxiliary {
        Some(ids) => {
            let payment_id = payment_result.to_string();
            let futures = ids.iter().map(|id| {
                    let pool = pool.clone();
                    let payment_id = payment_id.clone();
                    let id = id.clone();
                    async move {
                        // Insert into auxiliary table and get the ID
                        let aux_id: Option<sqlx::types::Uuid> = sqlx::query_scalar(
                            "INSERT INTO public.auxiliary (name, value, description, type, increment, decrement) 
                             VALUES ($1, $2::numeric, $3, $4, $5::boolean, $6::boolean) 
                             RETURNING id"
                        )
                            .bind(id.name)
                            .bind(id.value)
                            .bind(id.description)
                            .bind(id.r#type)
                            .bind(id.increment)
                            .bind(id.decrement)
                            .fetch_one(&*pool)
                            .await
                            .map_err(|e| format!("Failed to insert auxiliary: {}", e))?;
                        
                        // Link the auxiliary to the payment
                        if let Some(aux_id) = aux_id {
                            sqlx::query(
                                "INSERT INTO public.payment_linkable (payment_id, linkable_id, linkable_type) 
                                 VALUES ($1::uuid, $2::uuid, $3)"
                            )
                                .bind(payment_id)
                                .bind(aux_id)
                                .bind("auxiliary")
                                .execute(&*pool)
                                .await
                                .map_err(|e| format!("Failed to link auxiliary to payment: {}", e))?;
                        }
                        Ok(()) as Result<(), String>
                    }
                });
            try_join_all(futures).await?;
        }
        None => (),
    };
    let _ = fetch_latest_state(pool, state, app).await?;
    Ok(payment_result) // Return the UUID from the tuple
}

#[tauri::command]
async fn update_campaign(
    campaign_id: String,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<String, String> {
    // Get the current auth data to ensure user is authenticated
    let company_id = match &state.0 {
        Some(data) => data.company.id.clone(),
        None => return Err("Not authenticated".to_string()),
    };

    // First, check if the link already exists
    let existing_link = sqlx::query!(
        "SELECT id FROM public.campaign_linkable 
         WHERE campaign_id = $1::uuid 
         AND linkable_id = $2::uuid 
         AND linkable_type = 'company'",
        sqlx::types::Uuid::parse_str(&campaign_id)
            .map_err(|e| format!("Invalid campaign ID: {}", e))?,
        sqlx::types::Uuid::parse_str(&company_id)
            .map_err(|e| format!("Invalid company ID: {}", e))?
    )
    .fetch_optional(&*pool)
    .await
    .map_err(|e| format!("Failed to check campaign link: {}", e))?;

    match existing_link {
        // If link exists, delete it
        Some(_) => {
            sqlx::query!(
                "DELETE FROM public.campaign_linkable 
                 WHERE campaign_id = $1::uuid 
                 AND linkable_id = $2::uuid 
                 AND linkable_type = 'company'",
                sqlx::types::Uuid::parse_str(&campaign_id)
                    .map_err(|e| format!("Invalid campaign ID: {}", e))?,
                sqlx::types::Uuid::parse_str(&company_id)
                    .map_err(|e| format!("Invalid company ID: {}", e))?
            )
            .execute(&*pool)
            .await
            .map_err(|e| format!("Failed to delete campaign link: {}", e))?;

            // Fetch the latest state to ensure the app has up-to-date data
            let _ = fetch_latest_state(pool, state, app).await?;

            Ok(format!("Campaign link successfully removed"))
        }
        // If link doesn't exist, insert it
        None => {
            sqlx::query!(
                "INSERT INTO public.campaign_linkable 
                 (campaign_id, linkable_id, linkable_type) 
                 VALUES ($1::uuid, $2::uuid, 'company')",
                sqlx::types::Uuid::parse_str(&campaign_id)
                    .map_err(|e| format!("Invalid campaign ID: {}", e))?,
                sqlx::types::Uuid::parse_str(&company_id)
                    .map_err(|e| format!("Invalid company ID: {}", e))?
            )
            .execute(&*pool)
            .await
            .map_err(|e| format!("Failed to create campaign link: {}", e))?;

            // Fetch the latest state to ensure the app has up-to-date data
            let _ = fetch_latest_state(pool, state, app).await?;

            Ok(format!("Campaign link successfully created"))
        }
    }
}

#[tauri::command]
async fn send_email(email: String, payment_id: String) -> Result<String, String> {
    // Build the request to Supabase function
    let client = reqwest::Client::new();
    let response = client
        .post("https://xzjrkgzptjqoyxxeqchy.supabase.co/functions/v1/send_email")
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "payment_id": payment_id,
            "email_to": email
        }))
        .send()
        .await
        .map_err(|e| format!("Failed to send email request: {}", e))?;

    // Check response status
    if response.status().is_success() {
        Ok("Email sent successfully".to_string())
    } else {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        Err(format!("Failed to send email: {}", error_text))
    }
}

#[tauri::command]
async fn add_booking(
    person_id: String,
    start_date: String,
    end_date: String,
    staff_id: String,
    services: Vec<String>,
    pool: State<'_, PgPool>,
    state: State<'_, AuthState>,
    app: tauri::AppHandle,
) -> Result<String, String> {
    // Get the current auth data to ensure user is authenticated
    let company_id = match &state.0 {
        Some(data) => data.company.id.clone(),
        None => return Err("Not authenticated".to_string()),
    };

    // Execute SQL query to insert the booking and return the ID
    // Convert the booking_id string to UUID since the database expects UUID type
    let status_id = "2b6bf1b7-8d4b-4b36-946c-e3bd951f6021";

    // Use a transaction to ensure all operations are atomic
    let mut tx = match pool.begin().await {
        Ok(tx) => tx,
        Err(e) => return Err(format!("Failed to start transaction: {}", e)),
    };

    // Insert the booking and return the ID
    let booking_id = match sqlx::query_scalar::<_, sqlx::types::Uuid>(
        "INSERT INTO booking (customer_id, company_id, start_time, end_time, status_id, staff_id) 
         VALUES ($1::uuid, $2::uuid, $3::timestamp, $4::timestamp, $5::uuid, $6::uuid) 
         RETURNING id",
    )
    .bind(person_id.clone())
    .bind(company_id.clone())
    .bind(start_date.clone())
    .bind(end_date.clone())
    .bind(status_id.clone())
    .bind(staff_id.clone())
    .fetch_one(&mut *tx)
    // .fetch_one(&*pool)
    .await
    {
        Ok(id) => id,
        Err(e) => {
            let _ = tx.rollback().await;
            return Err(format!("Failed to create booking: {}", e));
        }
    };

    // Insert each service into the booking_linkable table
    for service_id in services {
        match sqlx::query(
            "INSERT INTO booking_linkable (booking_id, linkable_id, linkable_type) 
             VALUES ($1::uuid, $2::uuid, $3)",
        )
        .bind(booking_id)
        .bind(service_id)
        .bind("services")
        .execute(&mut *tx)
        .await
        {
            Ok(_) => (),
            Err(e) => {
                let _ = tx.rollback().await;
                return Err(format!("Failed to link service to booking: {}", e));
            }
        }
    }

    // Commit the transaction
    match tx.commit().await {
        Ok(_) => (),
        Err(e) => return Err(format!("Failed to commit transaction: {}", e)),
    }

    // Fetch the latest state to ensure the app has up-to-date data
    let _ = fetch_latest_state(pool, state, app).await?;

    Ok(booking_id.to_string())
}
