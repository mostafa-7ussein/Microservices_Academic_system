FROM node
WORKDIR /student
COPY package.json .
RUN npm install
COPY . .
RUN npm i -g nodemon
CMD ["nodemon", "index.js"]