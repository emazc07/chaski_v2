  # frozen_string_literal: true

  class Users::SessionsController < Devise::SessionsController
    def new
      self.resource = resource_class.new(sign_in_params)
      clean_up_passwords(resource)
      render inertia: "users/sessions/new"
    end

    def create
      self.resource = warden.authenticate(auth_options)

      if resource
        set_flash_message!(:notice, :signed_in)
        sign_in(resource_name, resource)
        redirect_to after_sign_in_path_for(resource)
      else
        redirect_to new_user_session_path, inertia: {
          errors: { email: [ I18n.t("devise.failure.invalid") ] }
        }
      end
    end
  end
