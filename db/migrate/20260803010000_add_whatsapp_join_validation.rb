class AddWhatsappJoinValidation < ActiveRecord::Migration[8.1]
  def up
    add_column :users, :whatsapp_phone, :string unless column_exists?(:users, :whatsapp_phone)
    add_column :events, :confirmation_code, :string unless column_exists?(:events, :confirmation_code)
    add_column :inscriptions, :confirmed_at, :datetime unless column_exists?(:inscriptions, :confirmed_at)

    change_column_default :inscriptions, :status, from: "active", to: "pending"

    alphabet = (("A".."Z").to_a + ("2".."9").to_a) - %w[O I]
    say_with_time "backfill event confirmation codes" do
      execute(<<~SQL.squish)
        UPDATE events
        SET confirmation_code = upper(substr(md5(random()::text || id::text), 1, 6))
        WHERE confirmation_code IS NULL OR confirmation_code = ''
      SQL

      # Normalize any ambiguous characters from md5 hex into the allowed alphabet
      Event.reset_column_information
      Event.unscoped.find_each do |event|
        code = event.confirmation_code.to_s.upcase.gsub(/[^A-HJ-NP-Z2-9]/, "")
        while code.length < 6
          code += alphabet[SecureRandom.random_number(alphabet.length)]
        end
        code = code[0, 6]
        execute(
          ActiveRecord::Base.sanitize_sql_array(
            [ "UPDATE events SET confirmation_code = ? WHERE id = ?", code, event.id ]
          )
        )
      end
    end

    change_column_null :events, :confirmation_code, false
    add_index :events, :confirmation_code unless index_exists?(:events, :confirmation_code)
  end

  def down
    change_column_default :inscriptions, :status, from: "pending", to: "active"
    remove_index :events, :confirmation_code if index_exists?(:events, :confirmation_code)
    remove_column :events, :confirmation_code if column_exists?(:events, :confirmation_code)
    remove_column :inscriptions, :confirmed_at if column_exists?(:inscriptions, :confirmed_at)
    remove_column :users, :whatsapp_phone if column_exists?(:users, :whatsapp_phone)
  end
end
