FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password, :avatar, :type, :name, :state] do |n|
    "string#{n}"
  end
  sequence :email do |n|
    "person#{n}@example.com"
  end
  sequence :description do |n|
    "description#{n}"
  end
  sequence :expired_at do
    Date.today + rand(1..30)
  end
end
