# nPassword

<img width="931" src="https://github.com/user-attachments/assets/c06fec58-9ba2-4b7d-812c-3d18b8d104da" />

<p align="center">
  A lightweight password manager for Windows Active Directory.
</p>

> nPassword is a pure front-end application. All data is stored in your browser's local storage and can be deployed as a static site (for example on GitHub Pages).
> This project is for research and educational use only. The author assumes no responsibility for any misuse.

## Features

- 🌐 **Pure Front-End** – credentials never leave your device.
- 🔐 **Domain-Specific Management** – organize accounts by AD domain.
- 📤 **One-Click Export / Import** – backup or share domain data in JSON.
- 🖥️ **Local Account Support** – store both domain and local machine accounts.
- 📝 **Add Notes** – attach notes to any account entry.
- 🎨 **User Friendly UI** – clean and responsive interface.
- ⚙️ **Auto Command Integration** – fill command templates with saved credentials.
- 📋 **Command Templates** – built-in examples for common tools.
- 🔧 **Customizable Templates** – *(coming soon)*.
- ...and more!

## TODO

- [x] Support for local account
- [x] Add a feature to allow adding notes to accounts
- [x] Fulfill more command templates
- [x] Fix UI/UX issues
- [ ] Add a feature to allow users to customize the command template

## Feature Demo

### Create an account with tags

https://github.com/user-attachments/assets/e7a37fe1-89b5-42fe-8c69-f90f928ddff9

### Auto-fill command templates with saved account info

https://github.com/user-attachments/assets/1f991b95-a011-4e35-b784-92eec4a3ed11

### Export and import domain data with JSON

```json
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
      "tags": ["domain admin"],
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

### Development

Install dependencies and start the local dev server:

```bash
npm install
npm run dev       # or yarn dev / pnpm dev / bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

To generate the static site:

```bash
npm run build
```

The production files will be output to the `dist/` directory as configured in `next.config.ts`. You can deploy these files to any static hosting platform such as GitHub Pages.

## License

This project is released under the [MIT License](LICENSE).
