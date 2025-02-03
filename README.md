# nPassword

This is a Password Manager for Windows Active Directory.

> This website is a purely front-end application, and all data is stored locally on the client’s device using local storage, then deploy on GitHub Pages.

> It is intended solely for research and educational purposes. The author assumes no legal or related responsibility for any consequences arising from the use of this tool.

## Demo

https://github.com/user-attachments/assets/611f2531-ba5c-4160-91a9-d7540355d7a7


## Feature

🌐 Pure Front-End: All data is stored locally on the client’s device.
🔐 Domain-Specific Account Management: Separate and manage accounts by domain.
📤 One-Click Export/Import: Easily backup or share domain data.
🖥️ Local Account Support: Manage both domain and local accounts.
📝 Add Notes: Attach notes to accounts.
🎨 User-Friendly UI: Intuitive and responsive design.
⚙️ Automatic Command Integration: Auto-fill command templates with saved account info.
📋 Command Templates: Pre-defined templates for various tools.
🔧 Customizable Templates: (Upcoming) Add and customize your own command templates.
...and more!

## TODO

- [x] Support for local account
- [x] Add a feature to allow adding notes to accounts.
- [x] fulfill more commands template
- [x] Fix UI/UX issues
- [ ] Add a feature to allow users to customize the command template.

## Getting Started

First, run the development server:

```bash
npm install

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
