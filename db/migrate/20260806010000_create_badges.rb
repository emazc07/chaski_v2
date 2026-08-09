class CreateBadges < ActiveRecord::Migration[8.1]
  def change
    create_table :badges do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description, null: false
      t.string :icon, null: false
      t.string :category, null: false
      t.string :rule_key
      t.integer :position, null: false, default: 0
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :badges, :name, unique: true
    add_index :badges, :slug, unique: true
    add_index :badges, :rule_key, unique: true
    add_check_constraint :badges,
                         "category IN ('milestone', 'destination', 'special', 'onboarding')",
                         name: "badges_category_check"
  end
end
