# nPassword

This is a Password Manager for Windows Active Directory.

> This website is a purely front-end application, and all data is stored locally on the client’s device using local storage, then deploy on GitHub Pages.

> It is intended solely for research and educational purposes. The author assumes no legal or related responsibility for any consequences arising from the use of this tool.

## Demo

https://github.com/user-attachments/assets/611f2531-ba5c-4160-91a9-d7540355d7a7


## Feature

- Domain-Specific Account Management:
    - Accounts are stored and managed separately for each domain, ensuring clear organization and accessibility.
- One-Click Export/Import of Domains:
    - Easily export or import domain-specific data with a single click, streamlining the process for backup or sharing.
- Automatic Command Template Integration:
    - Automatically applies saved account information to relevant command templates for tools like impacket and evil-winrm, reducing manual effort and errors.
- Pure Front-End Design:
    - This website operates entirely on the client side. No credentials, NTLM hashes, or sensitive data are processed or transmitted to external servers.


## TODO

- [x] Support for local account
- [x] Add a feature to allow adding notes to accounts.
- [x] fulfill more commands template
- [x] Fix UI/UX issues
- [ ] Add a feature to allow users to customize the command template.

## Getting Started

First, run the development server:

```bash
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
