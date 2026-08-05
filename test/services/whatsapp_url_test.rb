require "test_helper"

class WhatsappUrlTest < ActiveSupport::TestCase
  test "build creates wa.me link" do
    url = WhatsappUrl.build(phone: "+506 8888-7777", text: "Hola!")
    assert_equal "https://wa.me/50688887777?text=Hola%21", url
  end

  test "build returns nil for blank phone" do
    assert_nil WhatsappUrl.build(phone: "", text: "Hola")
  end
end
