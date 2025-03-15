This is the backend of a todo app. My first project after finishing the course of Web development.

The project is built with the next technologies:
  Backend:
    -nodejs
    -expressjs
    -mongoDB
    -mongoose as ODM
  FRONTEND:
    -Nextjs 
    -tailwind


Chat esta es la estructura del projecto. Asi me quedo modifique algunas cosas ahora quiero que me expliques que hace cada carpeta y archivo. Y si crees que debo cambiar algo de lugar o agregar algo dimelo

todo-app/
├── backend/
|____src/
│     ├── controllers/       
│     ├── models/     
      |__ middlewares/       
│     ├── routes/              
│     |__ db/
      |__ utils/              
│     ├── app.js            
│     └── constants.js
|     |__ index.js
|____ node_modules/
|____ .env
|____ .gitignore
|____ .prettierignore
|____ .prettierrc
|____ logger.js
|____ package-lock.json
|____ package.json          
│
├── frontend/
|___|__ node_modules/
|___|__ public/
|___|__ .gitignore
|___|__ eslint.config.mjs
|___|__ next-env.d.ts
|___|__ next.config.ts
|___|__ package-lock.json
|___|__ package.json
|___|__ postcss.config.mjs
|___|__ tsconfig.json
│   ├── src/
|___|____ app/  
│   │     ├── globals.css 
│   │     ├── layout.tsx          
│   │     |__ page.tsx                              
|
└── README.md                