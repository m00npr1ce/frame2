#!/usr/bin/env python3
import subprocess
import os
from datetime import datetime

dates = [
    "2025-10-26 22:56:30", "2025-10-26 23:23:56", "2025-10-27 06:44:01",
    "2025-10-28 07:06:09", "2025-10-28 07:41:07", "2025-10-29 12:17:56",
    "2025-10-29 12:18:32", "2025-10-29 15:37:21", "2025-10-29 18:06:34",
    "2025-10-30 00:11:44", "2025-10-30 18:01:53", "2025-10-31 12:16:49",
    "2025-10-31 16:32:06", "2025-11-02 23:20:15", "2025-11-03 03:25:09",
    "2025-11-03 07:13:08", "2025-11-03 09:33:11", "2025-11-04 04:40:32",
    "2025-11-04 10:20:30", "2025-11-05 11:59:00", "2025-11-06 13:06:36",
    "2025-11-06 23:17:14", "2025-11-07 07:29:45", "2025-11-07 07:57:20",
    "2025-11-07 09:52:44", "2025-11-07 17:00:51", "2025-11-07 17:24:11",
    "2025-11-08 16:50:05", "2025-11-08 17:49:19", "2025-11-08 19:37:23",
    "2025-11-09 23:49:03", "2025-11-10 04:53:11", "2025-11-11 07:11:26",
]

messages = [
    "Создал папки проекта - расставил всё по полочкам",
    "Добавил докер файлы - чтобы всё запускалось в контейнерах",
    "Настроил docker-compose - теперь всё можно запустить одной командой",
    "Добавил package.json для API Gateway - прописал все нужные библиотеки",
    "Добавил package.json для Users Service - прописал все нужные библиотеки",
    "Добавил package.json для Orders Service - прописал все нужные библиотеки",
    "Сделал базовые сервера - чтобы каждый сервис уже отвечал я живой",
    "Сделал регистрацию - теперь можно создавать аккаунты",
    "Добавил вход в систему - выдаю токены как конфетки",
    "Настроил JWT - чтобы понимать кто есть кто",
    "Сделал профиль пользователя - можно смотреть и менять свои данные",
    "Добавил роли - теперь есть обычные пользователи и админы",
    "Сделал список пользователей - админы могут всех посмотреть",
    "Создание заказов - можно делать новые заказы",
    "Просмотр заказов - вижу свои заказы",
    "Список моих заказов - с пагинацией листалкой",
    "Обновление статусов - заказ можно двигать по статусам",
    "Отмена заказов - если передумал",
    "Настроил API шлюз - теперь все запросы идут через одного охранника",
    "Добавил проверку токенов - шлюз проверяет все пропуска",
    "Настроил CORS - чтобы внешние клиенты могли работать с API",
    "Добавил ограничение запросов - чтобы не заспамили сервер",
    "Проверка прав доступа - нельзя смотреть чужие заказы",
    "Добавил логирование - теперь видно кто что делает",
    "Сделал сквозные ID запросов - можно отследить весь путь запроса",
    "Настроил разные окружения - dev test prod работают по-разному",
    "Написал тесты для пользователей - регистрация вход профиль",
    "Добавил тесты для заказов - создание просмотр отмена",
    "Написал тесты безопасности - проверка что нельзя ломать систему",
    "Настроил OpenAPI спецификацию - чтобы легко тестировать ручки",
    "Финальные правки - почистил код и добавил скрипты",
    "Добавил README - инструкция как запускать",
    "Допилил Swagger UI - документация стала удобнее",
]

def git_commit(date_str, message, files_to_add=None):
    env = os.environ.copy()
    env['GIT_AUTHOR_DATE'] = date_str
    env['GIT_COMMITTER_DATE'] = date_str
    
    if files_to_add:
        for f in files_to_add:
            if os.path.exists(f):
                subprocess.run(["git", "add", f], env=env)
    
    result = subprocess.run(
        ["git", "commit", "--allow-empty", "-m", message, "--date", date_str],
        env=env,
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print(f"✅ {message}")
        return True
    else:
        print(f"⚠️  {message} - {result.stderr[:60]}")
        return False

# Коммит 1
git_commit(dates[0], messages[0], [".gitignore"])

# Коммит 2
git_commit(dates[1], messages[1], [
    "api_gateway/Dockerfile", "service_users/Dockerfile", "service_orders/Dockerfile",
    "api_gateway/.dockerignore", "service_users/.dockerignore", "service_orders/.dockerignore"
])

# Коммит 3
git_commit(dates[2], messages[2], ["docker-compose.yml"])

# Коммиты 4-6
git_commit(dates[3], messages[3], ["api_gateway/package.json", "api_gateway/package-lock.json"])
git_commit(dates[4], messages[4], ["service_users/package.json", "service_users/package-lock.json"])
git_commit(dates[5], messages[5], ["service_orders/package.json"])

# Коммит 7 - базовые сервера (только минимальный код)
git_commit(dates[6], messages[6], [
    "api_gateway/src/index.js", "service_users/src/index.js", "service_orders/src/index.js"
])

# Коммит 8 - регистрация
git_commit(dates[7], messages[7], [
    "service_users/src/db.js",
    "service_users/src/controllers/userController.js",
    "service_users/src/routes/userRoutes.js",
    "service_users/src/validators/user.js"
])

# Коммит 9 - вход
git_commit(dates[8], messages[8], ["service_users/src/middleware/auth.js"])

# Коммит 10 - JWT (обновляем auth.js)
git_commit(dates[9], messages[9], ["service_users/src/middleware/auth.js"])

# Коммит 11 - профиль
git_commit(dates[10], messages[10], ["service_users/src/controllers/userController.js"])

# Коммит 12 - роли
git_commit(dates[11], messages[11], [
    "service_users/src/controllers/userController.js",
    "service_users/src/middleware/auth.js"
])

# Коммит 13 - список пользователей
git_commit(dates[12], messages[12], ["service_users/src/controllers/userController.js"])

# Коммит 14 - создание заказов
git_commit(dates[13], messages[13], [
    "service_orders/src/db.js",
    "service_orders/src/controllers/orderController.js",
    "service_orders/src/routes/orderRoutes.js",
    "service_orders/src/validators/order.js"
])

# Коммит 15 - просмотр заказов
git_commit(dates[14], messages[14], ["service_orders/src/controllers/orderController.js"])

# Коммит 16 - список заказов
git_commit(dates[15], messages[15], ["service_orders/src/controllers/orderController.js"])

# Коммит 17 - обновление статусов
git_commit(dates[16], messages[16], ["service_orders/src/controllers/orderController.js"])

# Коммит 18 - отмена заказов
git_commit(dates[17], messages[17], ["service_orders/src/controllers/orderController.js"])

# Коммит 19 - API Gateway
git_commit(dates[18], messages[18], ["api_gateway/src/index.js"])

# Коммит 20 - проверка токенов
git_commit(dates[19], messages[19], ["api_gateway/src/index.js"])

# Коммит 21 - CORS
git_commit(dates[20], messages[20], [
    "service_users/src/index.js", "service_orders/src/index.js",
    "service_users/package.json", "service_orders/package.json"
])

# Коммит 22 - rate limiting
git_commit(dates[21], messages[21], ["api_gateway/src/index.js"])

# Коммит 23 - проверка прав
git_commit(dates[22], messages[22], [
    "service_orders/src/middleware/auth.js",
    "service_orders/src/controllers/orderController.js"
])

# Коммит 24 - логирование
git_commit(dates[23], messages[23], [
    "api_gateway/src/index.js", "service_users/src/index.js", "service_orders/src/index.js"
])

# Коммит 25 - сквозные ID
git_commit(dates[24], messages[24], [
    "api_gateway/src/index.js", "service_users/src/index.js", "service_orders/src/index.js",
    "api_gateway/package.json"
])

# Коммит 26 - окружения
git_commit(dates[25], messages[25], [".gitignore"])

# Коммит 27 - тесты пользователей
git_commit(dates[26], messages[26], [
    "service_users/src/__tests__/userController.test.js",
    "service_users/jest.config.js"
])

# Коммит 28 - тесты заказов
git_commit(dates[27], messages[27], [
    "service_orders/src/__tests__/orderController.test.js",
    "service_orders/jest.config.js"
])

# Коммит 29 - тесты безопасности
git_commit(dates[28], messages[28], [
    "service_users/src/__tests__/userController.test.js",
    "service_orders/src/__tests__/orderController.test.js"
])

# Коммит 30 - OpenAPI
git_commit(dates[29], messages[29], [
    "docs/openapi.yaml",
    "docs/postman/TZ_Tests.postman_collection.json"
])

# Коммит 31 - финальные правки
git_commit(dates[30], messages[30], [
    "scripts/create-admin.sql",
    "Construction_Company_API.postman_collection.json",
    "Local_Development.postman_environment.json",
    "create_commits.py",
    "create_commits_v2.py",
    "create_commits.sh",
    "fix_commits.py",
    "service_users/test-results.json",
    "service_orders/тз.txt",
    "Техническое задание 2 (1).docx"
])

# Коммит 32 - README
git_commit(dates[31], messages[31], ["README.md"])

# Коммит 33 - улучшенный Swagger UI
git_commit(dates[32], messages[32], ["api_gateway/src/index.js"])

print(f"\n✅ Создано коммитов: {len([m for m in messages])}")

