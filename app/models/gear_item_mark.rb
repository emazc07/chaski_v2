class GearItemMark < ApplicationRecord
  belongs_to :inscription
  belongs_to :gear_item

  validates :gear_item_id, uniqueness: { scope: :inscription_id }
end
