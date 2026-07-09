<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="frontend/public/KazMunayGas_logo.svg">
  <img src="frontend/public/KazMunayGas_logo.svg" alt="KazMunayGas" height="72">
</picture>

<br/><br/>

# DMAIC Platform

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>
<p>
  <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" />
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" />
</p>
<p>
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" />
  <img src="https://img.shields.io/badge/GSAP-93CF2B?style=for-the-badge&logo=greensock&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<br/>

**Платформа геймификации Six Sigma DMAIC для КазМунайГаз**

*Участники проходят 4 этапа · Зарабатывают баррели · Соревнуются в рейтинге*

<br/>

</div>

---

<div align="center">

```
◆ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ◆
  D E F I N E  →  M E A S U R E  →  I M P R O V E  →  C O N T R O L
◆ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ◆
```

</div>

---

## 📋 Содержание

| | Раздел |
|---|---|
| 01 | [Обзор проекта](#-обзор-проекта) |
| 02 | [Технологический стек](#-технологический-стек) |
| 03 | [Архитектура системы](#-архитектура-системы) |
| 04 | [Дизайн-система](#-дизайн-система) |
| 05 | [WebGL & Анимации](#-webgl--анимации) |
| 06 | [Страницы и роуты](#-страницы-и-роуты) |
| 07 | [Система баррелей](#-система-баррелей) |
| 08 | [Этапы DMAIC](#-этапы-dmaic) |
| 09 | [Безопасность и роли](#-безопасность-и-роли) |
| 10 | [REST API](#-rest-api) |
| 11 | [Запуск проекта](#-запуск-проекта) |
| 12 | [Переменные окружения](#-переменные-окружения) |
| 13 | [Структура файлов](#-структура-файлов) |

---

## 🎯 Обзор проекта

**DMAIC Platform** — внутренний корпоративный веб-сервис КазМунайГаз, объединяющий методологию **Six Sigma DMAIC** с механиками геймификации. Сотрудники компании регистрируют прогресс по программе непрерывного совершенствования, получают оценки от экспертов и соревнуются за ценные награды.

<br/>

<table>
<tr>
<td width="50%">

**Для участников**
- Работа с 4 этапами DMAIC
- Загрузка материалов и отслеживание статуса
- Просмотр оценок и комментариев
- Позиция в публичном рейтинге

</td>
<td width="50%">

**Для администраторов**
- Просмотр всех участников
- Оценка загруженных работ (0–100)
- Автоматическое начисление баррелей
- Управление статусами этапов

</td>
</tr>
</table>

---

## 🛠 Технологический стек

### Frontend

<table>
<tr>
<th>Технология</th>
<th>Версия</th>
<th>Назначение</th>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" /></td>
<td>18</td>
<td>UI-фреймворк на основе компонентов</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" /></td>
<td>5</td>
<td>Статическая типизация</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E" /></td>
<td>5</td>
<td>Сборщик, HMR, dev-сервер с проксированием</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" /></td>
<td>3</td>
<td>Утилитарные CSS-классы</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Framer-black?style=flat-square&logo=framer&logoColor=blue" /></td>
<td>12</td>
<td>Анимации, spring-физика, scroll-driven эффекты</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/GSAP-93CF2B?style=flat-square&logo=greensock&logoColor=white" /></td>
<td>3</td>
<td>ScrollTrigger — профессиональные scroll-анимации</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Three.js-black?style=flat-square&logo=three.js&logoColor=white" /></td>
<td>0.184</td>
<td>WebGL — 3D-сцена с icosahedron и шейдерами</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white" /></td>
<td>v6</td>
<td>Маршрутизация SPA с защищёнными роутами</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Zustand-443E38?style=flat-square" /></td>
<td>4</td>
<td>Глобальное состояние: auth, theme</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" /></td>
<td>1.7</td>
<td>HTTP-клиент с JWT-интерсепторами</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/i18next-26A69A?style=flat-square&logo=i18next&logoColor=white" /></td>
<td>14</td>
<td>Двуязычность: русский / казахский</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Radix_UI-161618?style=flat-square" /></td>
<td>—</td>
<td>Доступные примитивы: Avatar, Dialog, Dropdown</td>
</tr>
</table>

### Backend

<table>
<tr>
<th>Технология</th>
<th>Версия</th>
<th>Назначение</th>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white" /></td>
<td>21</td>
<td>Основной язык бэкенда (LTS)</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white" /></td>
<td>3</td>
<td>Фреймворк: REST API, dependency injection, lifecycle</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white" /></td>
<td>—</td>
<td>Аутентификация, авторизация, роли</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" /></td>
<td>—</td>
<td>Реляционная БД с поддержкой ACID</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=JSON%20web%20tokens&logoColor=white" /></td>
<td>—</td>
<td>Stateless-токены HMAC-SHA, без сессий</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Flyway-CC0200?style=flat-square&logo=flyway&logoColor=white" /></td>
<td>—</td>
<td>Версионные миграции базы данных</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Persistent_Volume-6B7280?style=flat-square&logo=railway&logoColor=white" /></td>
<td>—</td>
<td>Постоянное хранилище загруженных файлов</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/Docker-2CA5E0?style=flat-square&logo=docker&logoColor=white" /></td>
<td>—</td>
<td>Воспроизводимая сборка Spring Boot и PostgreSQL</td>
</tr>
</table>

---

## 🏗 Архитектура системы

```
┌─────────────────────────────────────────────────────────────────┐
│                         КЛИЕНТ (браузер)                         │
│                                                                   │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                    React SPA (Vite)                       │   │
│   │                                                           │   │
│   │  /          /login       /dashboard    /dashboard/stage   │   │
│   │  HomePage   LoginPage    Dashboard     StagePage          │   │
│   │                                                           │   │
│   │  /admin     /admin/review/:userId                         │   │
│   │  AdminPage  AdminReviewPage                               │   │
│   │                                                           │   │
│   │  ┌─────────┐  ┌──────────┐  ┌────────────────────────┐   │   │
│   │  │ Zustand │  │  Axios   │  │    Three.js / GSAP     │   │   │
│   │  │  Store  │  │ +Bearer  │  │  WebGL · Animations    │   │   │
│   │  └─────────┘  └────┬─────┘  └────────────────────────┘   │   │
│   └───────────────────-┼──────────────────────────────────────┘   │
└───────────────────────-┼─────────────────────────────────────────┘
                         │  HTTP/REST  /api/*
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Spring Boot (port 8080)                        │
│                                                                   │
│   JWT Filter → SecurityConfig → Controllers → Services           │
│                                                                   │
│   /api/auth/**   /api/leaderboard   /api/stages/**               │
│   /api/admin/**  /api/files/**                                    │
│                                                                   │
│   ┌──────────────────────┐    ┌──────────────────────────────┐   │
│   │    Spring Data JPA   │    │    StorageService (Volume)    │   │
│   └──────────┬───────────┘    └──────────────┬───────────────┘   │
└──────────────┼──────────────────────────────-┼───────────────────┘
               │                               │
               ▼                               ▼
       ┌──────────────┐                ┌──────────────┐
       │  PostgreSQL  │                │   Volume     │
       │   (Flyway)   │                │   (файлы)    │
       └──────────────┘                └──────────────┘
```

---

## 🎨 Дизайн-система

### Философия

> *«Тёмный. Минималистичный. Премиальный.»*

Дизайн вдохновлён **Linear, Vercel, Apple** — почти чёрный фон с белым текстом и синими акцентами. Корпоративная идентичность КМГ сохраняется через структуру и пространство, не через агрессивное использование фирменных цветов.

---

### 🎨 Цветовая палитра

<table>
<tr>
<th>Переменная</th>
<th>Тёмная тема</th>
<th>Назначение</th>
</tr>
<tr><td><code>--canvas</code></td><td><img src="https://img.shields.io/badge/%20-010102?style=flat-square&color=010102" /> <code>#010102</code></td><td>Фон всей страницы</td></tr>
<tr><td><code>--s1</code></td><td><img src="https://img.shields.io/badge/%20-0f1011?style=flat-square&color=0f1011" /> <code>#0f1011</code></td><td>Поверхность 1 — карточки</td></tr>
<tr><td><code>--s2</code></td><td><img src="https://img.shields.io/badge/%20-141516?style=flat-square&color=141516" /> <code>#141516</code></td><td>Поверхность 2 — вложенные</td></tr>
<tr><td><code>--hl</code></td><td><img src="https://img.shields.io/badge/%20-23252a?style=flat-square&color=23252a" /> <code>#23252a</code></td><td>Разделители, бордеры</td></tr>
<tr><td><code>--accent</code></td><td><img src="https://img.shields.io/badge/%20-5b8dee?style=flat-square&color=5b8dee" /> <code>#5b8dee</code></td><td>Синий акцент</td></tr>
<tr><td><code>--barrel</code></td><td><img src="https://img.shields.io/badge/%20-D4A017?style=flat-square&color=D4A017" /> <code>#D4A017</code></td><td>Золото баррелей</td></tr>
<tr><td><code>--ink</code></td><td><img src="https://img.shields.io/badge/%20-f7f8f8?style=flat-square&color=f7f8f8" /> <code>#f7f8f8</code></td><td>Основной текст</td></tr>
<tr><td><code>--ink-subtle</code></td><td><img src="https://img.shields.io/badge/%20-8a8f98?style=flat-square&color=8a8f98" /> <code>#8a8f98</code></td><td>Вторичный текст</td></tr>
<tr><td><code>--success</code></td><td><img src="https://img.shields.io/badge/%20-27a644?style=flat-square&color=27a644" /> <code>#27a644</code></td><td>Одобрено</td></tr>
<tr><td><code>--danger</code></td><td><img src="https://img.shields.io/badge/%20-e54d2e?style=flat-square&color=e54d2e" /> <code>#e54d2e</code></td><td>Отклонено</td></tr>
</table>

---

### ✍️ Типографика

Шрифт: **Geist Sans** от Vercel — современный с поддержкой кириллицы

```
  display    │ 40px  │ weight 600 │ tracking −1.0px  │ Главные заголовки
  headline   │ 28px  │ weight 600 │ tracking −0.6px  │ Заголовки секций
  card-title │ 20px  │ weight 500 │ tracking −0.3px  │ Заголовки карточек
  body-lg    │ 16px  │ weight 400 │ tracking −0.1px  │ Крупный текст
  body       │ 14px  │ weight 400 │ tracking −0.1px  │ Основной текст
  caption    │ 12px  │ weight 400 │ tracking  0px    │ Подписи и метки
  eyebrow    │ 11px  │ weight 700 │ tracking +0.08em │ РУБРИКИ
```

---

## 🌐 WebGL & Анимации

### HeroCanvas — Three.js Icosahedron

```javascript
// Геометрия с высоким subdivision для плавного меша
IcosahedronGeometry(radius: 1.5, detail: 72)

// Кастомный GLSL Vertex Shader — Perlin Noise displacement
float d = snoise(position * 2.0 + time * 0.45) * 0.22;
vec3 newPos = position + normal * d;

// Fragment Shader — Fresnel effect + colour interpolation
mix(#5b8dee, #7c6ef5, pow(1.0 - dot(normal, viewDir), 2.5))

// Mouse tracking → point light follows cursor
window.addEventListener('mousemove', (e) => {
  const pos = unprojectMouseToScene(e.clientX, e.clientY)
  material.uniforms.uLight.value = pos
})
```

### RadialOrbitalTimeline

```
         ╭──────────────╮
    C ───┤  ●  ОРБИТА   ├─── D
         │              │
    I ───┤  ◉  центр    ├─── M/A
         ╰──────────────╯

  ● узлы вращаются со скоростью 0.3°/50ms
  ◉ клик → карточка с дедлайном + прогрессом
  → связанные этапы пульсируют
```

### Кривые анимаций

```
cubic-bezier(0.32, 0.72, 0, 1)  ←  Apple-like spring easing

Hero entrance:     opacity 0→1, translateY 24→0, blur 8→0px   750ms
CTA hover:         width 0→18px (иконка стрелки)               280ms
Table rows:        stagger 40ms, translateX −8→0                350ms
Barrel progress:   width 0→X% анимация                         600ms
Theme toggle icon: rotate 0→360°                               420ms
Theme switch:      CSS variables transition                     200ms
```

---

## 📄 Страницы и роуты

```
/                    ← Главная: Hero WebGL + Leaderboard + DMAIC орбита
/login               ← Вход в систему
/dashboard           ← Личный кабинет участника
/dashboard/stage/d   ← Этап D (Define)
/dashboard/stage/ma  ← Этап M/A (Measure + Analyze)
/dashboard/stage/i   ← Этап I (Improve)
/dashboard/stage/c   ← Этап C (Control)
/admin               ← Панель администратора
/admin/review/:id    ← Проверка работы участника
```

| Роут | Доступ | Редирект при ошибке |
|---|---|---|
| `/` | Публичный | — |
| `/login` | Публичный | `/dashboard` если авторизован |
| `/dashboard/**` | PARTICIPANT | `/login` |
| `/admin/**` | ADMIN | `/login` |

---

## 🛢 Система баррелей

> Администратор выставляет оценку **0–100** за каждый из 4 этапов.  
> Система автоматически конвертирует оценку в баррели через `BarrelService.computeReward()`.

```
  Оценка ≥ 100  →  ◆◆◆◆◆  5 баррелей
  Оценка ≥  80  →  ◆◆◆◆   4 барреля
  Оценка ≥  50  →  ◆◆     2 барреля
  Оценка ≥  40  →  ◆      1 баррель
  Оценка  <  40  →         0 баррелей

  Максимум: 4 этапа × 5 = ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆ 20 баррелей
```

### Награды

| Баррели | Награда |
|---|---|
| 🥇 20 | ✈️ Стажировка в Японии |
| 🥈 16–19 | 🏆 Награждение от председателя правления |
| 🥉 10–15 | 🎁 Брендированная продукция КМГ |
| — 1–9 | 🔖 Значок проекта DMAIC |

---

## 📅 Этапы DMAIC

```
  ┌─────────────────────────────────────────────────────────────────┐
  │                                                                   │
  │  01. D — DEFINE                                  → 30.06.2026   │
  │      Определение проблемы и целей проекта                        │
  │      Устав проекта · Карта процесса · VOC                        │
  │                                                                   │
  │  02. M/A — MEASURE + ANALYZE                     → 30.08.2026   │
  │      Сбор и анализ данных                                        │
  │      Измерение текущего состояния · Корневые причины             │
  │                                                                   │
  │  03. I — IMPROVE                                 → 30.11.2026   │
  │      Разработка и внедрение решений                              │
  │      Оптимизация процесса · Пилотное тестирование               │
  │                                                                   │
  │  04. C — CONTROL                                 → 20.12.2026   │
  │      Контроль и закрепление результатов                          │
  │      План управления · Документирование улучшений                │
  │                                                                   │
  └─────────────────────────────────────────────────────────────────┘
```

**Статусы этапа:**

```
  DRAFT  →  SUBMITTED  →  APPROVED
                       ↘  REJECTED  →  (повторная подача)
```

---

## 🔐 Безопасность и роли

```
┌────────────────────────────────────────────────────────────┐
│  JWT Flow                                                   │
│                                                             │
│  Login ──► Spring Security ──► JWT (HMAC-SHA, 24h)        │
│                                      │                      │
│                               localStorage                  │
│                               Zustand Store                 │
│                                      │                      │
│              Axios Interceptor ──────┘                      │
│              Authorization: Bearer <token>                  │
│                      │                                      │
│               Spring JWT Filter                             │
│                      │                                      │
│         ┌────────────┼────────────┐                        │
│         ▼            ▼            ▼                        │
│    /api/admin    /api/stages   /api/leaderboard             │
│    ADMIN only    AUTH only     PUBLIC                       │
└────────────────────────────────────────────────────────────┘
```

| Роль | Эндпоинты | Доступ |
|---|---|---|
| **ADMIN** | `/api/admin/**` | Оценка работ, управление |
| **PARTICIPANT** | `/api/stages/**`, `/api/files/**` | Загрузка, просмотр |
| **Гость** | `/api/leaderboard` | Только чтение |

> Аккаунт администратора создаётся автоматически при старте через `AdminInitializer` если пользователь не существует. Никаких hardcoded-паролей в коде.

---

## 📡 REST API

<details>
<summary><b>🔑 Auth</b></summary>

| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Вход, возвращает JWT |
| `GET` | `/api/auth/me` | ✓ | Текущий пользователь |
| `PATCH` | `/api/auth/me` | ✓ | Обновление профиля |

</details>

<details>
<summary><b>🏆 Leaderboard</b></summary>

| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `GET` | `/api/leaderboard` | Публичный | Рейтинг всех участников |

</details>

<details>
<summary><b>📋 Stages</b></summary>

| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `GET` | `/api/stages/:stage` | PARTICIPANT | Данные этапа |
| `POST` | `/api/stages/:stage/draft` | PARTICIPANT | Сохранить черновик |
| `POST` | `/api/stages/:stage/submit` | PARTICIPANT | Отправить на проверку |

</details>

<details>
<summary><b>🛡 Admin</b></summary>

| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `GET` | `/api/admin/users` | ADMIN | Все участники |
| `GET` | `/api/admin/review/:userId` | ADMIN | Этапы участника |
| `POST` | `/api/admin/review/:userId/score` | ADMIN | Выставить оценку |

</details>

<details>
<summary><b>📁 Files</b></summary>

| Метод | Endpoint | Доступ | Описание |
|---|---|---|---|
| `POST` | `/api/files/avatar` | ✓ | Загрузить аватар (JPEG/PNG/WebP ≤5MB) |
| `GET` | `/api/files/avatar/:id` | ✓ | Получить аватар |

</details>

---

## 🗄 Модели данных

<details>
<summary><b>User</b></summary>

```java
@Entity
class User {
  Long id;
  String username;          // логин
  String password;          // BCrypt hash
  String fullName;
  String position;          // должность
  String avatarUrl;
  Role role;                // ROLE_ADMIN | ROLE_PARTICIPANT
  LocalDateTime createdAt;
}
```
</details>

<details>
<summary><b>DmaicStage</b></summary>

```java
@Entity
class DmaicStage {
  Long id;
  User user;
  StageType stageType;      // D | M_A | I | C
  StageStatus status;       // DRAFT | SUBMITTED | APPROVED | REJECTED
  String content;
  String adminComment;
  Integer score;            // 0–100
  Integer barrels;          // 0–5
  LocalDateTime updatedAt;
}
```
</details>

<details>
<summary><b>Barrel</b></summary>

```java
@Entity
class Barrel {
  Long id;
  User user;
  DmaicStage stage;
  Integer count;            // 0–5
  Reward reward;            // JAPAN_TRIP | LEADERSHIP_AWARD | ...
}
```
</details>

---

Подробная инструкция облачного деплоя: [DEPLOYMENT.md](DEPLOYMENT.md).

## 🚀 Запуск проекта

### Требования

```
✓ Java 21+
✓ Node.js 18+
✓ Docker + Docker Compose
✓ Maven (или .\mvnw.cmd)
```

### 1. Настройка окружения

```bash
cp .env.example .env
# Заполни JWT_SECRET, DB_PASSWORD, ADMIN_USERNAME, ADMIN_PASSWORD
```

### 2. Инфраструктура (PostgreSQL)

```bash
docker-compose up -d

# Проверка
docker ps
# ✓ dmaic_postgres    running   0.0.0.0:5432

```

### 3. Бэкенд

```bash
cd backend
.\mvnw.cmd spring-boot:run

# Успешный запуск:
# ✓ Flyway migrations applied
# ✓ AdminInitializer: admin account ready
# ✓ Started DmaicApplication on port 8080
```

### 4. Фронтенд

```bash
cd frontend
npm install
npm run dev

# → http://localhost:5173
# → /api/* проксируется на :8080
```

### Продакшен-сборка

```bash
# Backend JAR
cd backend && .\mvnw.cmd clean package -DskipTests
java -jar target/dmaic-*.jar

# Frontend static
cd frontend && npm run build
# Артефакты → frontend/dist/
```

---

## ⚙️ Переменные окружения

```env
# ──────────────────────────────────
# Обязательные
# ──────────────────────────────────

JWT_SECRET=minimum-32-character-secret-key-here
# HMAC-SHA ключ подписи токенов
# Без него приложение не запустится

DB_PASSWORD=your_postgresql_password

ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
# Создаётся автоматически при первом запуске

# ──────────────────────────────────
# Docker (из docker-compose.yml)
# ──────────────────────────────────

DB_NAME=dmaic_db
DB_USER=dmaic_user
STORAGE_PATH=./data/uploads
PUBLIC_API_URL=http://localhost:8080
```

---

## 📁 Структура файлов

```
dmaic-platform/
│
├── 📄 docker-compose.yml
├── 📄 .env.example
├── 📄 README.md
│
├── 📂 backend/
│   └── src/main/java/kz/kmg/dmaic/
│       ├── 📂 entity/           User · Project · DmaicStage · Barrel
│       ├── 📂 repository/       Spring Data JPA репозитории
│       ├── 📂 service/          BarrelService · StorageService · UserService
│       ├── 📂 controller/       AuthController · LeaderboardController
│       │                        StageController · AdminController
│       ├── 📂 security/         JwtFilter · SecurityConfig · JwtService
│       ├── 📂 dto/              Request/Response DTO (без entity expose)
│       └── 📂 config/           AdminInitializer · CorsConfig · StorageConfig
│
└── 📂 frontend/
    ├── 📂 public/               favicon.svg · KazMunayGas_logo.svg
    └── src/
        ├── 📂 api/
        │   ├── auth.ts          login · logout · me
        │   ├── leaderboard.ts   GET /api/leaderboard
        │   ├── stages.ts        draft · submit · get
        │   └── admin.ts         users · review · score
        │
        ├── 📂 components/
        │   ├── 📂 ui/
        │   │   ├── hero-canvas.tsx              ← Three.js WebGL
        │   │   ├── radial-orbital-timeline.tsx  ← DMAIC орбита
        │   │   ├── mini-navbar.tsx              ← Floating pill nav
        │   │   ├── container-scroll-animation   ← Scroll reveal
        │   │   ├── dmaic-canvas.tsx             ← WebGL aurora
        │   │   ├── button · card · table
        │   │   ├── avatar · badge · dialog
        │   │   └── dropdown · checkbox · input
        │   │
        │   ├── BarrelIcon.tsx
        │   ├── DMAICTimeline.tsx
        │   ├── Layout.tsx
        │   ├── Leaderboard.tsx
        │   └── ThemeToggle.tsx
        │
        ├── 📂 pages/
        │   ├── HomePage.tsx       Hero + Leaderboard + DMAIC
        │   ├── LoginPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── StagePage.tsx
        │   └── 📂 admin/
        │       ├── AdminPage.tsx
        │       └── AdminReviewPage.tsx
        │
        ├── 📂 store/
        │   ├── authStore.ts    JWT токен · роль · logout
        │   └── themeStore.ts   dark / light · persist
        │
        └── 📂 i18n/
            ├── ru.json         Русский язык
            └── kz.json         Қазақ тілі
```

---

<div align="center">

```
◆ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ◆
```

<img src="frontend/public/KazMunayGas_logo.svg" alt="KMG" height="32">

**DMAIC Platform** — КазМунайГаз · 2026

*Внутренний проект · Все права защищены*

```
◆ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ◆
```

</div>
