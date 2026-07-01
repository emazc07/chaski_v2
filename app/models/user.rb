class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :name, presence:true

  enum :experience_level,{
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
  }

  enum :frequency,{

    monthly: "monthly",
    biweekly: "biweekly",
    weekly: "weekly",
    more_often: "more_often",

  }


end
