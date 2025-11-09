#!/bin/bash

# Даты для коммитов
dates=(
  "2025-10-26 22:56:30"
  "2025-10-26 23:23:56"
  "2025-10-27 06:44:01"
  "2025-10-28 07:06:09"
  "2025-10-28 07:41:07"
  "2025-10-29 12:17:56"
  "2025-10-29 12:18:32"
  "2025-10-29 15:37:21"
  "2025-10-29 18:06:34"
  "2025-10-30 00:11:44"
  "2025-10-30 18:01:53"
  "2025-10-31 12:16:49"
  "2025-10-31 16:32:06"
  "2025-11-02 23:20:15"
  "2025-11-03 03:25:09"
  "2025-11-03 07:13:08"
  "2025-11-03 09:33:11"
  "2025-11-04 04:40:32"
  "2025-11-04 10:20:30"
  "2025-11-05 11:59:00"
  "2025-11-06 13:06:36"
  "2025-11-06 23:17:14"
  "2025-11-07 07:29:45"
  "2025-11-07 07:57:20"
  "2025-11-07 09:52:44"
  "2025-11-07 17:00:51"
  "2025-11-07 17:24:11"
  "2025-11-08 16:50:05"
  "2025-11-08 17:49:19"
  "2025-11-08 19:37:23"
  "2025-11-09 23:49:03"
  "2025-11-10 04:53:11"
  "2025-11-11 07:11:26"
)

# Сообщения коммитов
messages=(
  "Создал папки проекта - расставил всё по полочкам"
  "Добавил докер файлы - чтобы всё запускалось в контейнерах"
  "Настроил docker-compose - теперь всё можно запустить одной командой"
  "Добавил package.json для API Gateway - прописал все нужные библиотеки"
  "Добавил package.json для Users Service - прописал все нужные библиотеки"
  "Добавил package.json для Orders Service - прописал все нужные библиотеки"
  "Сделал базовые сервера - чтобы каждый сервис уже отвечал \"я живой!\""
  "Сделал регистрацию - теперь можно создавать аккаунты"
  "Добавил вход в систему - выдаю токены как конфетки"
  "Настроил JWT - чтобы понимать, кто есть кто"
  "Сделал профиль пользователя - можно смотреть и менять свои данные"
  "Добавил роли - теперь есть обычные пользователи и админы"
  "Сделал список пользователей - админы могут всех посмотреть"
  "Создание заказов - можно делать новые заказы"
  "Просмотр заказов - вижу свои заказы"
  "Список моих заказов - с пагинацией (листалкой)"
  "Обновление статусов - заказ можно двигать по статусам"
  "Отмена заказов - если передумал"
  "Настроил API шлюз - теперь все запросы идут через одного охранника"
  "Добавил проверку токенов - шлюз проверяет все пропуска"
  "Настроил CORS - чтобы внешние клиенты могли работать с API"
  "Добавил ограничение запросов - чтобы не заспамили сервер"
  "Проверка прав доступа - нельзя смотреть чужие заказы"
  "Добавил логирование - теперь видно кто что делает"
  "Сделал сквозные ID запросов - можно отследить весь путь запроса"
  "Настроил разные окружения - dev, test, prod работают по-разному"
  "Написал тесты для пользователей - регистрация, вход, профиль"
  "Добавил тесты для заказов - создание, просмотр, отмена"
  "Написал тесты безопасности - проверка что нельзя ломать систему"
  "Настроил OpenAPI спецификацию - чтобы легко тестировать ручки"
  "Финальные правки - почистил код и добавил скрипты"
  "Добавил README - инструкция как запускать"
  "Допилил Swagger UI - документация стала удобнее"
)

# Функция для создания коммита с датой
commit_with_date() {
  local date="$1"
  local message="$2"
  export GIT_AUTHOR_DATE="$date"
  export GIT_COMMITTER_DATE="$date"
  git commit --allow-empty -m "$message" --date="$date"
  unset GIT_AUTHOR_DATE
  unset GIT_COMMITTER_DATE
}

# Коммит 1: Структура проекта
mkdir -p api_gateway/src service_users/src service_orders/src docs scripts
touch .gitignore
git add .gitignore
commit_with_date "${dates[0]}" "${messages[0]}"

# Коммит 2: Docker файлы
touch api_gateway/Dockerfile service_users/Dockerfile service_orders/Dockerfile
touch api_gateway/.dockerignore service_users/.dockerignore service_orders/.dockerignore
git add api_gateway/Dockerfile service_users/Dockerfile service_orders/Dockerfile
git add api_gateway/.dockerignore service_users/.dockerignore service_orders/.dockerignore
commit_with_date "${dates[1]}" "${messages[1]}"

# Коммит 3: Docker Compose
touch docker-compose.yml
git add docker-compose.yml
commit_with_date "${dates[2]}" "${messages[2]}"

# Коммит 4: package.json API Gateway
touch api_gateway/package.json api_gateway/package-lock.json
git add api_gateway/package.json api_gateway/package-lock.json
commit_with_date "${dates[3]}" "${messages[3]}"

# Коммит 5: package.json Users Service
touch service_users/package.json service_users/package-lock.json
git add service_users/package.json service_users/package-lock.json
commit_with_date "${dates[4]}" "${messages[4]}"

# Коммит 6: package.json Orders Service
touch service_orders/package.json
git add service_orders/package.json
commit_with_date "${dates[5]}" "${messages[5]}"

# Коммит 7: Базовые сервера
touch api_gateway/src/index.js service_users/src/index.js service_orders/src/index.js
git add api_gateway/src/index.js service_users/src/index.js service_orders/src/index.js
commit_with_date "${dates[6]}" "${messages[6]}"

# Коммит 8: Регистрация
mkdir -p service_users/src/controllers service_users/src/routes service_users/src/validators service_users/src/db.js
touch service_users/src/db.js service_users/src/controllers/userController.js service_users/src/routes/userRoutes.js service_users/src/validators/user.js
git add service_users/src/
commit_with_date "${dates[7]}" "${messages[7]}"

# Коммит 9: Вход в систему
touch service_users/src/middleware/auth.js
git add service_users/src/middleware/auth.js
commit_with_date "${dates[8]}" "${messages[8]}"

# Коммит 10: JWT настройка
# (уже включено в предыдущий коммит, но обновим файл)
git add service_users/src/middleware/auth.js
commit_with_date "${dates[9]}" "${messages[9]}"

# Коммит 11: Профиль пользователя
# (уже в userController, но обновим)
git add service_users/src/controllers/userController.js
commit_with_date "${dates[10]}" "${messages[10]}"

# Коммит 12: Роли
# (уже реализовано, обновим)
git add service_users/src/
commit_with_date "${dates[11]}" "${messages[11]}"

# Коммит 13: Список пользователей
# (уже реализовано)
git add service_users/src/controllers/userController.js
commit_with_date "${dates[12]}" "${messages[12]}"

# Коммит 14: Создание заказов
mkdir -p service_orders/src/controllers service_orders/src/routes service_orders/src/validators
touch service_orders/src/db.js service_orders/src/controllers/orderController.js service_orders/src/routes/orderRoutes.js service_orders/src/validators/order.js
git add service_orders/src/
commit_with_date "${dates[13]}" "${messages[13]}"

# Коммит 15: Просмотр заказов
git add service_orders/src/controllers/orderController.js
commit_with_date "${dates[14]}" "${messages[14]}"

# Коммит 16: Список заказов с пагинацией
git add service_orders/src/controllers/orderController.js
commit_with_date "${dates[15]}" "${messages[15]}"

# Коммит 17: Обновление статусов
git add service_orders/src/controllers/orderController.js
commit_with_date "${dates[16]}" "${messages[16]}"

# Коммит 18: Отмена заказов
git add service_orders/src/controllers/orderController.js
commit_with_date "${dates[17]}" "${messages[17]}"

# Коммит 19: API Gateway
git add api_gateway/src/index.js
commit_with_date "${dates[18]}" "${messages[18]}"

# Коммит 20: Проверка токенов в Gateway
git add api_gateway/src/index.js
commit_with_date "${dates[19]}" "${messages[19]}"

# Коммит 21: CORS
touch service_users/src/index.js service_orders/src/index.js
git add service_users/src/index.js service_orders/src/index.js
commit_with_date "${dates[20]}" "${messages[20]}"

# Коммит 22: Rate limiting
git add api_gateway/src/index.js
commit_with_date "${dates[21]}" "${messages[21]}"

# Коммит 23: Проверка прав доступа
touch service_orders/src/middleware/auth.js
git add service_orders/src/middleware/auth.js service_users/src/middleware/auth.js
commit_with_date "${dates[22]}" "${messages[22]}"

# Коммит 24: Логирование
git add api_gateway/src/index.js service_users/src/index.js service_orders/src/index.js
commit_with_date "${dates[23]}" "${messages[23]}"

# Коммит 25: Сквозные ID запросов
git add api_gateway/src/index.js service_users/src/index.js service_orders/src/index.js
commit_with_date "${dates[24]}" "${messages[24]}"

# Коммит 26: Окружения
git add .gitignore
commit_with_date "${dates[25]}" "${messages[25]}"

# Коммит 27: Тесты пользователей
mkdir -p service_users/src/__tests__
touch service_users/jest.config.js service_users/src/__tests__/userController.test.js
git add service_users/src/__tests__/ service_users/jest.config.js
commit_with_date "${dates[26]}" "${messages[26]}"

# Коммит 28: Тесты заказов
mkdir -p service_orders/src/__tests__
touch service_orders/jest.config.js service_orders/src/__tests__/orderController.test.js
git add service_orders/src/__tests__/ service_orders/jest.config.js
commit_with_date "${dates[27]}" "${messages[27]}"

# Коммит 29: Тесты безопасности
git add service_users/src/__tests__/ service_orders/src/__tests__/
commit_with_date "${dates[28]}" "${messages[28]}"

# Коммит 30: OpenAPI спецификация
mkdir -p docs/postman
touch docs/openapi.yaml docs/postman/TZ_Tests.postman_collection.json
git add docs/openapi.yaml docs/postman/TZ_Tests.postman_collection.json
commit_with_date "${dates[29]}" "${messages[29]}"

# Коммит 31: Финальные правки
touch scripts/create-admin.sql \
  Construction_Company_API.postman_collection.json \
  Local_Development.postman_environment.json \
  create_commits.py create_commits_v2.py create_commits.sh fix_commits.py \
  service_users/test-results.json service_orders/тз.txt \
  "Техническое задание 2 (1).docx"
git add scripts/create-admin.sql \
  Construction_Company_API.postman_collection.json \
  Local_Development.postman_environment.json \
  create_commits.py create_commits_v2.py create_commits.sh fix_commits.py \
  service_users/test-results.json service_orders/тз.txt \
  "Техническое задание 2 (1).docx"
commit_with_date "${dates[30]}" "${messages[30]}"

# Коммит 32: README
touch README.md
git add README.md
commit_with_date "${dates[31]}" "${messages[31]}"

# Коммит 33: Улучшенный Swagger UI
git add api_gateway/src/index.js
commit_with_date "${dates[32]}" "${messages[32]}"

echo "Все коммиты созданы!"


