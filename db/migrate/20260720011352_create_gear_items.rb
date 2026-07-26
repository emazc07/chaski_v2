class CreateGearItems < ActiveRecord::Migration[8.1]
  def change
    create_table :gear_items do |t|
      t.references :event, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.boolean :required, null: false, default: true
      t.integer :position, null: false, default: 0

      t.timestamps
    end
  end
end
