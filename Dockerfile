FROM node:14.16.0-alpine3.13
RUN addgroup app && adduser -S -G app app
USER app
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
ENV jwtPrivateKey=HoangLoc
EXPOSE 3000

#.Shell form
#./bin/sh
#.cmd
# CMD npm start

#.Exec form
# faster because can execute directly
CMD ["npm", "start"]