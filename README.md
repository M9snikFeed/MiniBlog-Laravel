# MiniBlog-Laravel

MiniBlog-Laravel - скрипт блога. Бэкенд работает на фреймворке Laravel(PHP), фронтенд на VueJS (SPA Aplication).
Основной функционал:
* Авторизация\регистрация
* Свой API
* Добавление\удаление записей
* Добавление\Удаление комментариев под записями
* Свой профиль у каждого пользователя
* Админка с большим функционалом
* Возможность включить ReCapcha

## Требования к серверу (если не используется docker)
OS: Linux

Software: 
  * PHP v7.4
  * Composer => 1.10.13
  * NginX => 1.19.2
  * MySQL => 8.0.19
  
# Установка без использования docker:

* Переместить скрипт на сервер
* В терминале перейти в директорию со скриптом и выполнить команду - composer install
* Отредактировать файл конфигурации ( .env в корневой папке скрипта)
* Поменять размер макс. загружаемого файла в php.conf (по умолчанию 2мб, т.е можно загрузить изображение с макс. объемом в 2мб).
* Настроить nginx(подробная информация приведена ниже).
* Выполнить команды `php artisan migrate:install`и `php artisan migrate: fresh`

## Настройка nginx
* /etc/nginx/nginx.conf: в блок http добавить `client_max_body_size 210m` (без этого не будут загружаться изображения)
* в конфиге самого сайта (/etc/nginx/sites-enabled) поправить блок location, сделать постоянные редиректы на index.php: `try_files $uri $uri/ /index.php?$query_string;\\`


# Запуск с использованием docker-compose:

На ПК должны быть установлены docker и docker-compose, 
скачать можно на официальном сайте: https://www.docker.com/get-started

* Перейти в корень проекта, ввести команду `docker-compose up -d --build site`
* В контейнере с PHP выполнить команды
- `php artisan migrate:install`
- `php artisan migrate: fresh`

## Контейнеры: 
- **nginx** - `:8080`
- **mysql** - `:3306`
- **php** - `:9000`

## Дополнительные команды для docker
- `docker-compose run --rm composer update`
- `docker-compose run --rm npm run dev`
- `docker-compose run --rm artisan migrate` 

## Постоянное хранилище MySQL


По умолчанию, когда вы выключаете сеть Docker, ваши данные из MySQL удаляются после уничтожения контейнеров. Если вы хотите, чтобы данные оставались постоянными после отключения и резервного копирования контейнеров, то требуется выполнить следующие действия:

1. Создайте каталог `mysql` в корневой папке проекта.
2. Добавьте volume в `docker-compose.yml` файл:

```
volumes:
  - ./mysql:/var/lib/mysql
```
