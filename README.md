# CS:GO Trade Tracker

A modern, full-stack web application for tracking CS:GO (Steam) skin trading activities. Built with Next.js, TypeScript, and TailwindCSS, this application provides a dashboard to monitor trades, calculate profits, and view detailed statistics, all backed by a secure database and user authentication.

## Table of Contents

- [Features](#features)
- [Technical Stack](#technical-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- **User Authentication**: Secure user registration and login via NextAuth.js.
- **Private Dashboards**: Each user has a private dashboard to manage their own trading data.
- **CRUD Operations**: Full Create, Read, Update, and Delete functionality for trade entries.
- **Automated Calculations**: Automatic calculation of `Profit`, `ROI`, and `Days to Sell`.
- **Summary Statistics**: A top-level dashboard displaying key metrics like `Total Profit`, `Unsold Item Count`, and `Cash on Hand`.
- **Interactive Data Table**:
  - Sorting and filtering by any column.
  - Search by item name.
  - Inline editing, adding, and deleting rows.
- **Visual Feedback**: Color-coded rows and stats to indicate profit (green) and loss (red).
- **Responsive Design**: Mobile-friendly UI built with TailwindCSS.
- **Data Export**: Optional feature to export trade data to CSV/Excel.

## Technical Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Compatible with Vercel Postgres, Supabase, etc.)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) (for base components like tables, buttons, inputs)
- **Deployment**: [Vercel](https://vercel.com/)

## Database Schema

The database schema is managed with Prisma. The primary model is `Trade`, which is linked to a `User`.

```prisma
// file: prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  trades        Trade[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum TradeStatus {
  SOLD
  UNSOLD
}

model Trade {
  id              String      @id @default(cuid())
  itemName        String
  buyDate         DateTime
  sellDate        DateTime?
  buyPrice        Float
  sellPrice       Float?
  siteCommission  Float?
  status          TradeStatus @default(UNSOLD)

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Project Structure

```
.
├── app/
│   ├── (auth)/                 # Auth routes (login, etc.)
│   ├── (main)/                 # Main app routes (dashboard)
│   │   └── (dashboard)/
│   │       ├── _components/    # Dashboard-specific components
│   │       └── page.tsx        # Dashboard page
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts    # NextAuth.js route handler
│   │   └── trades/             # API routes for trades
│   └── layout.tsx
├── components/
│   └── ui/                     # Shadcn/UI components
├── lib/
│   ├── auth.ts                 # NextAuth.js configuration
│   ├── db.ts                   # Prisma client instance
│   └── utils.ts                # Utility functions
├── prisma/
│   ├── migrations/
│   └── schema.prisma           # Database schema
├── public/
├── scripts/
│   └── seed.ts                 # Seeding script
├── .env.example                # Environment variable template
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- A [PostgreSQL](https://www.postgresql.org/) database (e.g., from [Supabase](https://supabase.com) or a local instance)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/csgo-trade-tracker.git
    cd csgo-trade-tracker
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Environment Variables

Create a `.env` file in the root of the project by copying the `.env.example` file.

```bash
cp .env.example .env
```

Fill in the required environment variables:

-   `DATABASE_URL`: Your PostgreSQL connection string.
-   `NEXTAUTH_URL`: The canonical URL of your deployment (e.g., `http://localhost:3000`).
-   `NEXTAUTH_SECRET`: A secret key for NextAuth.js. Generate one with `openssl rand -base64 32`.
-   `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: Your GitHub OAuth app credentials (or any other provider).

### Running the Application

1.  **Apply database migrations:**
    This command will create the tables in your database based on the `schema.prisma` file.
    ```bash
    pnpm prisma migrate dev
    ```

2.  **(Optional) Seed the database with demo data:**
    ```bash
    pnpm prisma db seed
    ```

3.  **Start the development server:**
    ```bash
    pnpm dev
    ```

The application will be available at `http://localhost:3000`.

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Push your code to a Git repository** (e.g., GitHub).
2.  **Import the project into Vercel.**
3.  **Configure Environment Variables**: Add the same environment variables from your `.env` file to the Vercel project settings.
4.  **Deploy**: Vercel will automatically build and deploy the application. It will also handle the Prisma client generation during the build step.

## API Endpoints

-   `GET /api/trades`: Fetches all trades for the authenticated user.
-   `POST /api/trades`: Creates a new trade entry.
-   `PUT /api/trades/[id]`: Updates a specific trade.
-   `DELETE /api/trades/[id]`: Deletes a specific trade.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.