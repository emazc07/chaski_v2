class GearItem < ApplicationRecord
  belongs_to :event
  has_many :gear_item_marks, dependent: :destroy
  has_many :inscriptions, through: :gear_item_marks

  validates :name, presence: true, length: { maximum: 80 }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:position, :id) }
end
