# TByteNews Project

TByteNews is a web application built using Next.js, Supabase, and Vercel. It consists of a main site for readers and an admin panel for managing content. This README provides an overview of the project structure, setup instructions, and usage.

## Project Structure

```
TByteNews
├── src
│   ├── components
│   │   ├── Admin
│   │   │   └── index.tsx        # Admin component for managing posts
│   │   └── Main
│   │       └── index.tsx        # Main component for displaying posts
│   ├── pages
│   │   ├── admin
│   │   │   └── index.tsx        # Entry point for the admin panel
│   │   ├── index.tsx            # Entry point for the main site
│   │   └── _app.tsx             # Initializes pages and global styles
│   ├── styles
│   │   ├── admin.module.css      # Styles for the admin panel
│   │   └── main.module.css       # Styles for the main site
│   └── utils
│       └── supabaseClient.ts     # Supabase client for backend interactions
├── public                        # Static assets (images, icons, etc.)
├── package.json                  # npm configuration file
├── tsconfig.json                 # TypeScript configuration file
└── README.md                     # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd TByteNews
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure Supabase:**
   - Create a Supabase project at [supabase.io](https://supabase.io).
   - Update the `supabaseClient.ts` file with your Supabase URL and API key.

4. **Run the development server:**
   ```
   npm run dev
   ```
   Navigate to `http://localhost:3000` to view the application.

## Features

- **Main Site:** Displays a list of posts in a card/grid format for readers.
- **Admin Panel:** Allows for CRUD operations on posts, providing an interface for content management.

## Deployment

This application can be deployed on Vercel. Simply connect your GitHub repository to Vercel and follow the deployment instructions.

## License

This project is licensed under the MIT License. See the LICENSE file for details.