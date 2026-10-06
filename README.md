# Fox AI Business Agent

A smart business agent for FoxSD, designed to listen to your instructions, organize projects, track clients, manage tasks, and keep business operations structured.

## Brand identity
- Brand name: FoxSD
- Alias: Fox
- Contact: foxsd520@gmail.com

## Features
- Real SQLite database
- Client management
- Project tracking
- Task dashboard
- Voice command input
- Business summary panel
- Simple business workflow

## Run locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

## Database
The app uses a local SQLite database located at:

```text
data/foxdb.sqlite
```

## Project structure

```text
fox-ai-business-agent/
├── data/
│   ├── foxdb.sqlite
│   ├── schema.sql
│   └── seed.sql
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── package.json
├── server.js
└── README.md
```

## Notes
This app is built only with the FoxSD identity and does not reference any other company name.
