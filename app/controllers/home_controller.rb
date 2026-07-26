class HomeController < InertiaController
  def index
    render inertia: "home/index"
  end
end
