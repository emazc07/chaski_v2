Rails.application.routes.draw do
  devise_for :users, controllers:{

    registrations: "users/registrations",
    sessions: "users/sessions",

  }
  get "home/index"

  get    "/events",          to: "events#index"
  get    "/events/mine",     to: "events#mine"
  get    "/events/new",      to: "events#new"
  post   "/events",          to: "events#create"
  get    "/events/:id",      to: "events#show"
  get    "/events/:id/edit", to: "events#edit"
  patch  "/events/:id",      to: "events#update"
  delete "/events/:id",      to: "events#destroy"

  get "events/all", to: "events#all"
  get "/hikes/mine", to: "hikes#mine"

  # Redirect to localhost from 127.0.0.1 to use same IP address with Vite server
  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end
  root 'events#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
