# nPassword

<img width="931" src="https://github.com/user-attachments/assets/c06fec58-9ba2-4b7d-812c-3d18b8d104da">
<p align="center">
  This is a Password Manager for Windows Active Directory.
</p>



> This website is a purely front-end application, and all data is stored locally on the client’s device using local storage, then deploy on GitHub Pages.

> It is intended solely for research and educational purposes. The author assumes no legal or related responsibility for any consequences arising from the use of this tool.

## Feature

- 🌐 Pure Front-End: All data is stored locally on the client’s device.
- 🔐 Domain-Specific Account Management: Separate and manage accounts by domain.
- 📤 One-Click Export/Import: Easily backup or share domain data.
- 🖥️ Local Account Support: Manage both domain and local accounts.
- 📝 Add Notes: Attach notes to accounts.
- 🎨 User-Friendly UI: Intuitive and responsive design.
- ⚙️ Automatic Command Integration: Auto-fill command templates with saved account info.
- 📋 Command Templates: Pre-defined templates for various tools.
- 🔧 Customizable Templates: (Upcoming) Add and customize your own command templates.
- ...and more!

## TODO

- [x] Support for local account
- [x] Add a feature to allow adding notes to accounts.
- [x] fulfill more commands template
- [x] Fix UI/UX issues
- [ ] Add a feature to allow users to customize the command template.

## Feature Demo

### Create account with tag.

https://github.com/user-attachments/assets/e7a37fe1-89b5-42fe-8c69-f90f928ddff9

### Auto-fill command templates with saved account info.

https://github.com/user-attachments/assets/1f991b95-a011-4e35-b784-92eec4a3ed11

### Export and Import domain data with JSON

```
{
  "name": "example.tld",
  "accounts": [
    {
      "username": "Alice",
      "password": "qwer1234!",
      "ntlmHash": "",
      "tags": [],
      "type": "domain",
      "host": ""
    },
    {
      "username": "Bob",
      "password": "",
      "ntlmHash": "00000000000000000000000000000000:7ECFFFF0C3548187607A14BAD0F88BB1",
      "tags": [
        "domain admin"
      ],
      "type": "domain",
      "host": ""
    },
    {
      "username": "Cindy",
      "password": "1qaz@WSX",
      "ntlmHash": "",
      "tags": [],
      "type": "domain",
      "host": ""
    }
  ]
}

```

---

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


