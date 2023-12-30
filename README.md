<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deploy on Render:
- Register on [render.com](https://render.com/).
- Go to dashboard and create Postgres database:
![2023-12-30 18_53_34-Window](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/3dab422d-676b-404c-bce9-e77d6d3ec1a3)
![image](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/f5427524-ec5e-45d2-93ff-c2ecfeeb52ee)


- When database is up and running, create new web service:
![image](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/ff95697d-6f78-4ff8-a388-06292526f70c)
![image](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/f411a859-c507-4bcc-bb69-7595f56f9f99)

- Connect your repository to Render:
![image](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/5801bd36-37e1-4d89-af18-6275d385a320)
![2023-12-30 19_07_39-Window](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/a548c4cd-98f7-4e6b-8466-4bf041370eff)

- Name your web service something:
![image](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/d157510a-a5fb-47ee-bdce-adca02ec828d)

- Specify build and start commands:

Build:
```
npm install && npm run build && npx prisma migrate deploy
```
Start: 
```
npm run start:prod
```
![image](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/afa1528f-5ea8-4600-8503-1bc9b501cdeb)

- Specify environment variables and click 'Create Web Service':

![image](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/27bb148c-455c-4a82-b066-0ff132de0f63)

DATABASE_URL is internal url from database you created earlier:
![image](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/2e7eca46-3910-4d3c-93dd-82284f262169)

- After successfull deploy, swap 'https://tasks.app.rs.school/angular/' in your angular project to your web service address:

![image](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/21c61ce9-3150-4e6f-b00d-fd084818c9d6)

(*^o^)人 (^o^*)





### P.S.
If web service that is hosted on render is not used frequently enough, it goes asleep and wake-up times are really long.
You can create a cron job on [cron-job.org](https://cron-job.org/), that will poke your backend every so often so it can stay awake:
![2023-12-30 19_50_40-Window](https://github.com/ShaggyRobot/connectionsBack/assets/71377866/939e08ac-f6d3-4662-96e5-b4b4ec96355f)

