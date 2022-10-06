admin = Admin.find_or_create_by(first_name: 'admin', last_name: 'admin', email: 'admin@localhost')
admin.password = 'admin'
admin.save

60.times do |i|
  u = [Manager, Developer].sample.new
  u.email = "email#{i}@mail.gen"
  u.first_name = "FN#{i}"
  u.last_name = "LN#{i}"
  u.password = "#{i}"
  u.save
end

30.times do |i|
  t = Task.new
  t.name = "Task_#{i}"
  t.description = "Desc#{i}"
  t.author_id = Manager.all.sample.id
  t.assignee_id = Developer.all.sample.id
  t.expired_at = (Time.now + 5.days).to_date
  t.save
end
