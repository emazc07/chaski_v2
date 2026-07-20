class CreateInscriptions < ActiveRecord::Migration[8.1]
  def change
    create_table :inscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :event, null: false, foreign_key: true
      t.string :status, null: false, default: "active"
      t.text :cancellation_reason
      t.datetime :cancelled_at

      t.timestamps
    end

    add_index :inscriptions, [ :user_id, :event_id ], unique: true
  end
end
