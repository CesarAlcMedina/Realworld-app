FROM cypress/base:22.15.1

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

RUN npx cypress verify

RUN ["npm", "run", "cypress:run1"]