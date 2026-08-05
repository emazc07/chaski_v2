class WhatsappUrl
  def self.build(phone:, text:)
    digits = phone.to_s.gsub(/\D/, "")
    return nil if digits.blank?

    "https://wa.me/#{digits}?text=#{ERB::Util.url_encode(text)}"
  end

  def self.inscription_message(hiker_name:, event_title:, event_url:)
    <<~TEXT.strip
      Hola! Soy #{hiker_name}. Me interesa la caminata "#{event_title}" en Chaski (#{event_url}). ¿Me podrías pasar el código de confirmación para completar mi inscripción y coordinamos el pago?
    TEXT
  end
end
