class CreateGearItemMarks < ActiveRecord::Migration[8.1]
  def change
    create_table :gear_item_marks do |t|
      t.references :inscription, null: false, foreign_key: true
      t.references :gear_item, null: false, foreign_key: true

      t.timestamps
    end

    add_index :gear_item_marks, [ :inscription_id, :gear_item_id ], unique: true
  end
end
