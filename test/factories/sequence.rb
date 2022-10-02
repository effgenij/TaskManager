FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password, :avatar, :type, :name] do |n|
    "string#{n}"
  end
  sequence :email do |n|
    "person#{n}@example.com"
  end
  sequence :description do |n|
    "description#{n}"
  end
  sequence :expired_at do
    rand(1..30).days.after
  end
end
