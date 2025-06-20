# Feedback Forms

A clean, modern feedback collection and management system built with **Laravel** and **React**.

## ✨ Features

### 🛠️ Form Creation & Management

- Create custom feedback forms with various question types
- Drag & drop question reordering using `dnd-kit`
- Draft & published status control
- Share forms via public link

### 📋 Question Types

- Short and long text input
- Single-select multiple choice
- Rating scales
- Email field

### 📥 Feedback Collection

- Public-facing mobile-responsive forms
- Form validation
- "Thank You" page after submission

### 📊 Feedback Management

- List view of all form submissions
- Detailed view for individual responses
- Daily response tracking chart with `Chart.js`

---

## 🧰 Tech Stack

- **Backend**: Laravel 10
- **Frontend**: React with Inertia.js
- **Styling**: TailwindCSS
- **Charts**: Chart.js
- **Notifications**: react-hot-toast
- **Drag & Drop**: dnd-kit

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/feedback-forms.git
cd feedback-forms
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Update the `.env` file:

```
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Create the SQLite database file:

```bash
touch database/database.sqlite
```

### 5. Run Migrations

```bash
php artisan migrate
```

### 6. Build Frontend Assets

```bash
npm run build
```

### 7. Start Development Server

```bash
php artisan serve
```

Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.
