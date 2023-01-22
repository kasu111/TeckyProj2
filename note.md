#setup

npm init -y
npm install -D typescript ts-node @types/node
npx tsc --init
touch .gitignore
    node_modules .env

npm install express
npm install -D @types/express
npm install ts-node-dev

npm install express-session
npm install -D @types/express-session


//// hashing password///
npm install bcryptjs @types/bcryptjs
import * as bcrypt from "bcryptjs"