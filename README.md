# 📚 Інструкція зі запуску проєкту

## 📦 Вимоги

- **Node.js** >= 16.x  
- **npm** або **yarn**
- **MongoDB** (локально або у хмарі, наприклад [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

## 🚀 Клонування репозиторію

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

## 🔧 Сервер (Backend)

### 1. Перехід у директорію

```bash
cd Backend
```

### 2. Встановлення залежностей

```bash
npm install
```

### 3. Налаштування змінних середовища

Заповніть змінні:

```env
MONGO_URL=mongodb+srv:...
PORT=3000


REGISTRATION=/registration
LOG_IN=/login
REFRESH=/refresh
ACTIVE_LINK=/active
GET_USER=/get_users
GET_EVENTS=/get_events
FILTER_USERS=/filter_users
CREATE_USER=/create_user
ADD_EVENT=/add_event
```

### 4. Запуск сервера

```bash
npm run dev
```

Сервер буде доступний за адресою: `http://localhost:3000`

---

## 🌐 Клієнт (Frontend, Vue.js)

### 1. Перехід у директорію

```bash
cd Users_Events_CRUD_App
```

### 2. Встановлення залежностей

```bash
npm install
```

### 3. Запуск клієнта

```bash
npm run dev
```

Клієнт буде доступний за адресою: `http://localhost:5173`

---


## ✅ Готово

Після запуску ви зможете:
- Керувати користувачами
- Створювати події
- Фільтрувати список
- Переглядати дату найближчої події

