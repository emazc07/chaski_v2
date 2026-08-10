require "test_helper"

class BadgeTest < ActiveSupport::TestCase
  test "generates slug from name on create" do
    badge = build_badge(name: "Explorador de Costa Rica")

    assert badge.save, badge.errors.full_messages.join(", ")
    assert_equal "explorador-de-costa-rica", badge.slug
  end

  test "adds suffix when generated slug already exists" do
    badge = build_badge(name: "Volcan Poas")

    assert badge.save, badge.errors.full_messages.join(", ")
    assert_equal "volcan-poas-2", badge.slug
  end

  test "does not allow slug to change after creation" do
    badge = badges(:first_hike)
    badge.slug = "slug-modificado"

    assert_not badge.save
    assert_includes badge.errors[:slug],
                    "no puede modificarse después de crear el badge"
  end

  test "uses string-backed categories" do
    assert_equal(
      {
        "milestone" => "milestone",
        "destination" => "destination",
        "special" => "special",
        "onboarding" => "onboarding"
      },
      Badge.categories
    )
  end

  test "rejects an invalid category" do
    badge = build_badge(category: "unknown")

    assert_not badge.valid?
    assert_includes badge.errors[:category], "is not included in the list"
  end

  test "active scope returns only active badges" do
    assert_includes Badge.active, badges(:first_hike)
    assert_not_includes Badge.active, badges(:inactive_destination)
  end

  test "allows false but rejects nil for active" do
    assert build_badge(active: false).valid?

    badge = build_badge(active: nil)

    assert_not badge.valid?
    assert badge.errors[:active].present?
  end

  test "does not destroy a badge that has been earned" do
    badge = badges(:first_hike)

    assert_no_difference "Badge.count" do
      assert_not badge.destroy
    end

    assert badge.errors[:base].present?
    assert Badge.exists?(badge.id)
  end

  test "allows destroying a badge without user badges" do
    badge = badges(:inactive_destination)

    assert_difference "Badge.count", -1 do
      assert badge.destroy
    end
  end

  private

  def build_badge(attributes = {})
    Badge.new(
      {
        name: "Nuevo badge",
        description: "Descripción del badge",
        icon: "badge_icon",
        category: :milestone,
        position: 0,
        active: true
      }.merge(attributes)
    )
  end
end
