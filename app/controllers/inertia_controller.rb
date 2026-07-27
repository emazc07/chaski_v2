# frozen_string_literal: true

class InertiaController < ApplicationController
  inertia_share auth: -> {
    {
      user: current_user && current_user.as_json(only: [ :id, :name, :email, :admin ]).merge(
        "avatar_url" => current_user.avatar_url
      )
    }
  }

  inertia_share flash: -> {
    {
      notice: flash[:notice],
      alert: flash[:alert]
    }
  }
end
