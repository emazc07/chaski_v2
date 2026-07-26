class Inscription < ApplicationRecord
  belongs_to :user
  belongs_to :event

  has_many :gear_item_marks, dependent: :destroy
  has_many :gear_items, through: :gear_item_marks

  enum :status, {
    active: "active",
    cancelled: "cancelled",
    attended: "attended",
    no_show: "no_show"
  }
end
