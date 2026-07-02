class CreateEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :events do |t|
      t.references :organizer, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.string :slug, null: false
      t.string :description_short, null: false
      t.text :description_long, null: false
      t.string :custom_location, null: false
      t.string :difficulty, null: false
      t.decimal :distance_km, precision: 5, scale: 2, null: false
      t.integer :elevation_gain_m, null: false
      t.decimal :duration_hours, precision: 4, scale: 1, null: false
      t.string :route_type, null: false
      t.datetime :starts_at, null: false
      t.text :meeting_point, null: false
      t.integer :max_participants, null: false
      t.integer :price_crc, default: 0, null: false
      t.string :status, default: "published", null: false

      t.timestamps
    end

    add_index :events, :slug, unique: true
  end
end
