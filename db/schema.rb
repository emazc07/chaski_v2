# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_07_13_022159) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "events", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "custom_location", null: false
    t.text "description_long", null: false
    t.string "description_short", null: false
    t.string "difficulty", null: false
    t.decimal "distance_km", precision: 5, scale: 2, null: false
    t.decimal "duration_hours", precision: 4, scale: 1, null: false
    t.integer "elevation_gain_m", null: false
    t.integer "max_participants", null: false
    t.text "meeting_point", null: false
    t.bigint "organizer_id", null: false
    t.integer "price_crc", default: 0, null: false
    t.string "route_type", null: false
    t.string "slug", null: false
    t.datetime "starts_at", null: false
    t.string "status", default: "published", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["organizer_id"], name: "index_events_on_organizer_id"
    t.index ["slug"], name: "index_events_on_slug", unique: true
  end

  create_table "inscriptions", force: :cascade do |t|
    t.text "cancellation_reason"
    t.datetime "cancelled_at"
    t.datetime "created_at", null: false
    t.bigint "event_id", null: false
    t.string "status", default: "active", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["event_id"], name: "index_inscriptions_on_event_id"
    t.index ["user_id", "event_id"], name: "index_inscriptions_on_user_id_and_event_id", unique: true
    t.index ["user_id"], name: "index_inscriptions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.boolean "admin", default: false, null: false
    t.text "bio"
    t.date "birthday"
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "emergency_contact"
    t.string "encrypted_password", default: "", null: false
    t.string "experience_level"
    t.string "frequency"
    t.string "location"
    t.string "name", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "events", "users", column: "organizer_id"
  add_foreign_key "inscriptions", "events"
  add_foreign_key "inscriptions", "users"
end
