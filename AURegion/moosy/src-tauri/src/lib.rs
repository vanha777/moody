use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{FromRow, PgPool};
use tauri::{Manager, State};

#[derive(FromRow)]
struct LoginResult {
    result: Value,
}

#[tauri::command]
async fn login(
    pool: State<'_, PgPool>,
    username: String, 
    password: String
) -> Result<serde_json::Value, String> {
    println!("username: {}", username);

    // Create SHA256 hash of the password
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let password_hash = hex::encode(hasher.finalize());
    
    println!("Attempting login with password hash: {}", password_hash);

    // Call the stored procedure/function directly with Option<> to handle NULL
    let result = sqlx::query_scalar::<_, Option<serde_json::Value>>(
        "SELECT * FROM public.get_company_details_by_owner($1, $2)"
    )
    .bind(&username)
    .bind(&password_hash)
    .fetch_one(&*pool)
    .await
    .map_err(|e| format!("Database error: {}", e.to_string()))?;

    // Check if we got a NULL result or no result at all
    let result = match result {
        Some(value) => value,
        None => return Err("Invalid username or password".to_string()),
    };

    // Return the result
    Ok(result)
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

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
