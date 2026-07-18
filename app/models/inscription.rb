class Inscription < ApplicationRecord
  belongs_to :user
  belongs_to :event

  enum :status, {
    active: "active",
    cancelled: "cancelled",
    attended: "attended",
    no_show: "no_show"
  }
end
