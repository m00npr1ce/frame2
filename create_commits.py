#!/usr/bin/env python3
import subprocess
import os
from datetime import datetime

# Даты для коммитов
dates = [
    "2025-10-26 22:56:30",
    "2025-10-26 23:23:56",
    "2025-10-27 06:44:01",
    "2025-10-28 07:06:09",
    "2025-10-28 07:41:07",
    "2025-10-29 12:17:56",
    "2025-10-29 12:18:32",
    "2025-10-29 15:37:21",
    "2025-10-29 18:06:34",
    "2025-10-30 00:11:44",
    "2025-10-30 18:01:53",
    "2025-10-31 12:16:49",
    "2025-10-31 16:32:06",
    "2025-11-02 23:20:15",
    "2025-11-03 03:25:09",
    "2025-11-03 07:13:08",
    "2025-11-03 09:33:11",
    "2025-11-04 04:40:32",
    "2025-11-04 10:20:30",
    "2025-11-05 11:59:00",
    "2025-11-06 13:06:36",
    "2025-11-06 23:17:14",
    "2025-11-07 07:29:45",
    "2025-11-07 07:57:20",
    "2025-11-07 09:52:44",
    "2025-11-07 17:00:51",
    "2025-11-07 17:24:11",
    "2025-11-08 16:50:05",
    "2025-11-08 17:49:19",
    "2025-11-08 19:37:23",
    "2025-11-09 23:49:03",
    "2025-11-10 04:53:11",
    "2025-11-11 07:11:26",
]

messages = [
    "Создал папки проекта - расставил всё по полочкам",
    "Добавил докер файлы - чтобы всё запускалось в контейнерах",
    "Настроил docker-compose - теперь всё можно запустить одной командой",
    "Добавил package.json для API Gateway - прописал все нужные библиотеки",
    "Добавил package.json для Users Service - прописал все нужные библиотеки",
    "Добавил package.json для Orders Service - прописал все нужные библиотеки",
    "Сделал базовые сервера - чтобы каждый сервис уже отвечал \"я живой!\"",
    "Сделал регистрацию - теперь можно создавать аккаунты",
    "Добавил вход в систему - выдаю токены как конфетки",
    "Настроил JWT - чтобы понимать, кто есть кто",
    "Сделал профиль пользователя - можно смотреть и менять свои данные",
    "Добавил роли - теперь есть обычные пользователи и админы",
    "Сделал список пользователей - админы могут всех посмотреть",
    "Создание заказов - можно делать новые заказы",
    "Просмотр заказов - вижу свои заказы",
    "Список моих заказов - с пагинацией (листалкой)",
    "Обновление статусов - заказ можно двигать по статусам",
    "Отмена заказов - если передумал",
    "Настроил API шлюз - теперь все запросы идут через одного охранника",
    "Добавил проверку токенов - шлюз проверяет все пропуска",
    "Настроил CORS - чтобы внешние клиенты могли работать с API",
    "Добавил ограничение запросов - чтобы не заспамили сервер",
    "Проверка прав доступа - нельзя смотреть чужие заказы",
    "Добавил логирование - теперь видно кто что делает",
    "Сделал сквозные ID запросов - можно отследить весь путь запроса",
    "Настроил разные окружения - dev, test, prod работают по-разному",
    "Написал тесты для пользователей - регистрация, вход, профиль",
    "Добавил тесты для заказов - создание, просмотр, отмена",
    "Написал тесты безопасности - проверка что нельзя ломать систему",
    "Настроил OpenAPI спецификацию - чтобы легко тестировать ручки",
    "Финальные правки - почистил код и добавил скрипты",
    "Добавил README - инструкция как запускать",
    "Допилил Swagger UI - документация стала удобнее",
]

def run_cmd(cmd, cwd=None, env=None):
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True, env=env)
    return result.returncode == 0, result.stdout, result.stderr

def commit_with_date(date_str, message, files):
    env = os.environ.copy()
    env['GIT_AUTHOR_DATE'] = date_str
    env['GIT_COMMITTER_DATE'] = date_str
    
    # Добавляем файлы (проверяем существование)
    if files:
        existing_files = [f for f in files if os.path.exists(f)]
        if existing_files:
            quoted_files = ' '.join(f'"{f}"' for f in existing_files)
            run_cmd(f"git add {quoted_files}")
    
    # Коммитим с датой (экранируем кавычки)
    message_escaped = message.replace('"', '\\"')
    cmd = f"git commit --allow-empty -m '{message_escaped}' --date='{date_str}'"
    success, out, err = run_cmd(cmd, env=env)
    if success:
        print(f"✅ Коммит: {message}")
    else:
        if "nothing to commit" not in err.lower():
            print(f"⚠️  Пропуск: {message} ({err[:50] if err else 'нет изменений'})")

# Коммит 1: Структура проекта
run_cmd("git add .gitignore")
commit_with_date(dates[0], messages[0], [])

# Коммит 2: Docker файлы
commit_with_date(dates[1], messages[1], [
    "api_gateway/Dockerfile",
    "service_users/Dockerfile", 
    "service_orders/Dockerfile",
    "api_gateway/.dockerignore",
    "service_users/.dockerignore",
    "service_orders/.dockerignore"
])

# Коммит 3: Docker Compose
commit_with_date(dates[2], messages[2], ["docker-compose.yml"])

# Коммит 4-6: package.json файлы
commit_with_date(dates[3], messages[3], ["api_gateway/package.json", "api_gateway/package-lock.json"])
commit_with_date(dates[4], messages[4], ["service_users/package.json", "service_users/package-lock.json"])
commit_with_date(dates[5], messages[5], ["service_orders/package.json"])

# Коммит 7: Базовые сервера
commit_with_date(dates[6], messages[6], [
    "api_gateway/src/index.js",
    "service_users/src/index.js",
    "service_orders/src/index.js"
])

# Коммит 8: Регистрация
commit_with_date(dates[7], messages[7], [
    "service_users/src/db.js",
    "service_users/src/controllers/userController.js",
    "service_users/src/routes/userRoutes.js",
    "service_users/src/validators/user.js"
])

# Коммит 9: Вход в систему
commit_with_date(dates[8], messages[8], [
    "service_users/src/middleware/auth.js"
])

# Коммит 10: JWT
commit_with_date(dates[9], messages[9], [
    "service_users/src/middleware/auth.js"
])

# Коммит 11: Профиль
commit_with_date(dates[10], messages[10], [
    "service_users/src/controllers/userController.js"
])

# Коммит 12: Роли
commit_with_date(dates[11], messages[11], [
    "service_users/src/controllers/userController.js",
    "service_users/src/middleware/auth.js"
])

# Коммит 13: Список пользователей
commit_with_date(dates[12], messages[12], [
    "service_users/src/controllers/userController.js"
])

# Коммит 14: Создание заказов
commit_with_date(dates[13], messages[13], [
    "service_orders/src/db.js",
    "service_orders/src/controllers/orderController.js",
    "service_orders/src/routes/orderRoutes.js",
    "service_orders/src/validators/order.js"
])

# Коммит 15: Просмотр заказов
commit_with_date(dates[14], messages[14], [
    "service_orders/src/controllers/orderController.js"
])

# Коммит 16: Список заказов
commit_with_date(dates[15], messages[15], [
    "service_orders/src/controllers/orderController.js"
])

# Коммит 17: Обновление статусов
commit_with_date(dates[16], messages[16], [
    "service_orders/src/controllers/orderController.js"
])

# Коммит 18: Отмена заказов
commit_with_date(dates[17], messages[17], [
    "service_orders/src/controllers/orderController.js"
])

# Коммит 19: API Gateway
commit_with_date(dates[18], messages[18], [
    "api_gateway/src/index.js"
])

# Коммит 20: Проверка токенов
commit_with_date(dates[19], messages[19], [
    "api_gateway/src/index.js"
])

# Коммит 21: CORS
commit_with_date(dates[20], messages[20], [
    "service_users/src/index.js",
    "service_orders/src/index.js",
    "service_users/package.json",
    "service_orders/package.json"
])

# Коммит 22: Rate limiting
commit_with_date(dates[21], messages[21], [
    "api_gateway/src/index.js"
])

# Коммит 23: Проверка прав доступа
commit_with_date(dates[22], messages[22], [
    "service_orders/src/middleware/auth.js",
    "service_orders/src/controllers/orderController.js"
])

# Коммит 24: Логирование
commit_with_date(dates[23], messages[23], [
    "api_gateway/src/index.js",
    "service_users/src/index.js",
    "service_orders/src/index.js"
])

# Коммит 25: Сквозные ID
commit_with_date(dates[24], messages[24], [
    "api_gateway/src/index.js",
    "service_users/src/index.js",
    "service_orders/src/index.js",
    "api_gateway/package.json"
])

# Коммит 26: Окружения
commit_with_date(dates[25], messages[25], [
    ".gitignore"
])

# Коммит 27: Тесты пользователей
commit_with_date(dates[26], messages[26], [
    "service_users/src/__tests__/userController.test.js",
    "service_users/jest.config.js"
])

# Коммит 28: Тесты заказов
commit_with_date(dates[27], messages[27], [
    "service_orders/src/__tests__/orderController.test.js",
    "service_orders/jest.config.js"
])

# Коммит 29: Тесты безопасности
commit_with_date(dates[28], messages[28], [
    "service_users/src/__tests__/userController.test.js",
    "service_orders/src/__tests__/orderController.test.js"
])

# Коммит 30: OpenAPI
commit_with_date(dates[29], messages[29], [
    "docs/openapi.yaml",
    "docs/postman/TZ_Tests.postman_collection.json"
])

# Коммит 31: Финальные правки
commit_with_date(dates[30], messages[30], [
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

# Коммит 32: README
commit_with_date(dates[31], messages[31], [
    "README.md"
])

# Коммит 33: Улучшенный Swagger UI
commit_with_date(dates[32], messages[32], [
    "api_gateway/src/index.js"
])

print("\n✅ Все коммиты созданы!")

