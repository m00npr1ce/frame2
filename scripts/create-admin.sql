-- Скрипт для создания администратора
-- Использование: подключитесь к базе данных users_db и выполните этот скрипт
-- После регистрации пользователя через API, выполните:

-- Обновить существующего пользователя до администратора
UPDATE users 
SET roles = ARRAY['user', 'admin']::TEXT[] 
WHERE email = 'admin@example.com';

-- Или создать администратора напрямую (не рекомендуется, т.к. пароль не будет захеширован)
-- INSERT INTO users (email, password_hash, name, roles)
-- VALUES (
--   'admin@example.com',
--   '$2b$10$YourHashedPasswordHere', -- Используйте bcrypt для хеширования пароля
--   'Admin User',
--   ARRAY['user', 'admin']::TEXT[]
-- );


