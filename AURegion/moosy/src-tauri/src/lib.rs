use serde_json::Value;
use sha2::{Digest, Sha256};
use sqlx::{FromRow, PgPool};
use tauri::{Manager, State};

#[derive(FromRow)]
struct LoginResult {
    result: Value,
}

#[tauri::command]
async fn login<'a>(
    pool: State<'a, PgPool>,
    username: String,
    password: String,
) -> Result<serde_json::Value, String> {
    println!("username: {}", username);

    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let password_hash = hex::encode(hasher.finalize());

    let result = sqlx::query_as::<_, LoginResult>(
        r#"
WITH owner_role AS (
    SELECT l.username, l.password_hash, r.company_id
    FROM login l
    JOIN people p ON p.id = l.person_id
    JOIN role r ON r.person_id = p.id
    WHERE l.username = $1
    AND l.password_hash = $2
    AND r.role_name = 'owner'
    LIMIT 1
)
SELECT json_build_object(
    'username', o.username,
    'password_hash', o.password_hash,
    'roles', json_build_object(
        'owner', (
            SELECT json_agg(
                json_build_object(
                    'id', p.id,
                    'personal_information', (
                        SELECT json_build_object(
                            'first_name', pi.first_name,
                            'last_name', pi.last_name,
                            'date_of_birth', pi.date_of_birth,
                            'gender', pi.gender
                        )
                        FROM personal_information pi
                        WHERE pi.person_id = p.id
                    ),
                    'contact_method', (
                        SELECT json_agg(
                            json_build_object(
                                'id', cm.id,
                                'type', cm.type,
                                'value', cm.value,
                                'is_primary', cm.is_primary
                            )
                        )
                        FROM contact_method cm
                        WHERE cm.person_id = p.id
                    )
                )
            )
            FROM people p
            JOIN role r ON r.person_id = p.id
            WHERE r.company_id = o.company_id
            AND r.role_name = 'owner'
        ),
        'admin', (
            SELECT json_agg(
                json_build_object(
                    'id', p.id,
                    'personal_information', (
                        SELECT json_build_object(
                            'first_name', pi.first_name,
                            'last_name', pi.last_name,
                            'date_of_birth', pi.date_of_birth,
                            'gender', pi.gender
                        )
                        FROM personal_information pi
                        WHERE pi.person_id = p.id
                    ),
                    'contact_method', (
                        SELECT json_agg(
                            json_build_object(
                                'id', cm.id,
                                'type', cm.type,
                                'value', cm.value,
                                'is_primary', cm.is_primary
                            )
                        )
                        FROM contact_method cm
                        WHERE cm.person_id = p.id
                    )
                )
            )
            FROM people p
            JOIN role r ON r.person_id = p.id
            WHERE r.company_id = o.company_id
            AND r.role_name = 'admin'
        ),
        'staff', (
            SELECT json_agg(
                json_build_object(
                    'id', p.id,
                    'personal_information', (
                        SELECT json_build_object(
                            'first_name', pi.first_name,
                            'last_name', pi.last_name,
                            'date_of_birth', pi.date_of_birth,
                            'gender', pi.gender
                        )
                        FROM personal_information pi
                        WHERE pi.person_id = p.id
                    ),
                    'contact_method', (
                        SELECT json_agg(
                            json_build_object(
                                'id', cm.id,
                                'type', cm.type,
                                'value', cm.value,
                                'is_primary', cm.is_primary
                            )
                        )
                        FROM contact_method cm
                        WHERE cm.person_id = p.id
                    )
                )
            )
            FROM people p
            JOIN role r ON r.person_id = p.id
            WHERE r.company_id = o.company_id
            AND r.role_name = 'staff'
        ),
        'customer', (
            SELECT json_agg(
                json_build_object(
                    'id', p.id,
                    'personal_information', (
                        SELECT json_build_object(
                            'first_name', pi.first_name,
                            'last_name', pi.last_name,
                            'date_of_birth', pi.date_of_birth,
                            'gender', pi.gender
                        )
                        FROM personal_information pi
                        WHERE pi.person_id = p.id
                    ),
                    'contact_method', (
                        SELECT json_agg(
                            json_build_object(
                                'id', cm.id,
                                'type', cm.type,
                                'value', cm.value,
                                'is_primary', cm.is_primary
                            )
                        )
                        FROM contact_method cm
                        WHERE cm.person_id = p.id
                    )
                )
            )
            FROM people p
            JOIN role r ON r.person_id = p.id
            WHERE r.company_id = o.company_id
            AND r.role_name = 'customer'
        )
    ),
    'company', (
        SELECT json_build_object(
            'id', c.id,
            'name', c.name,
            'description', c.description,
            'currency_id', c.currency_id,
            'timetable', (
                SELECT json_agg(
                    json_build_object(
                        'id', t.id,
                        'company_id', t.company_id,
                        'day_of_week', t.day_of_week,
                        'start_time', t.start_time,
                        'end_time', t.end_time
                    )
                ) FROM timetable t WHERE t.company_id = c.id
            ),
            'services', (
                SELECT json_agg(
                    json_build_object(
                        'id', s.id,
                        'company_id', s.company_id,
                        'name', s.name,
                        'duration', s.duration,
                        'price', s.price
                    )
                ) FROM services s WHERE s.company_id = c.id
            ),
            'contact_method', (
                SELECT json_agg(
                    json_build_object(
                        'id', cm.id,
                        'type', cm.type,
                        'value', cm.value,
                        'is_primary', cm.is_primary
                    )
                ) FROM contact_method cm WHERE cm.company_id = c.id
            )
        ) FROM companies c WHERE c.id = o.company_id
    ),
    'bookings', (
        SELECT json_agg(
            json_build_object(
                'id', b.id,
                'customer_id', b.customer_id,
                'staff_id', b.staff_id,
                'service_id', b.service_id,
                'company_id', b.company_id,
                'start_time', b.start_time,
                'end_time', b.end_time,
                'status_id', b.status_id
            )
        ) FROM booking b 
        WHERE b.company_id = o.company_id
    )
) AS result
FROM owner_role o;
        "#,
    )
    .bind(&username)
    .bind(&password_hash)
    .fetch_one(&*pool)
    .await
    .map_err(|e| format!("Database error: {}", e.to_string()))?;

    Ok(result.result)
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
