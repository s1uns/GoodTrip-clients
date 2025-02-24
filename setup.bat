@echo off
echo Створюємо структуру проєкту...

:: Створення основних папок
mkdir src\modules\auth\components
mkdir src\modules\auth\pages
mkdir src\modules\places\components
mkdir src\modules\places\pages
mkdir src\modules\profile\components
mkdir src\modules\profile\pages
mkdir src\components\ui
mkdir src\layouts
mkdir src\router
mkdir src\store
mkdir src\services
mkdir src\utils

:: Створення базових файлів
echo. > src\modules\auth\store.ts
echo. > src\modules\auth\api.ts
echo. > src\modules\auth\routes.ts
echo. > src\modules\places\store.ts
echo. > src\modules\places\api.ts
echo. > src\modules\places\routes.ts
echo. > src\modules\profile\store.ts
echo. > src\modules\profile\api.ts
echo. > src\modules\profile\routes.ts
echo. > src\router\index.ts
echo. > src\router\routes.ts
echo. > src\store\index.ts
echo. > src\services\api.ts
echo. > src\utils\helpers.ts

echo ✅ Структура проєкту створена!
pause
