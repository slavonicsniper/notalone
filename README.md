# notalone
web app to find a buddy for an activity

# create .env file in the root directory with the following values

```
dbConnectionString='postgres://<user>:<password>@localhost:5432/<dbName>'
SECRET=<randomString>
DATABASE_URL=<herokuDBURLForsequelizeProductionMigrations>
JWT_ACC_ACTIVATE=<randomString>
JWT_RESET_PASSWORD=<randomString>
CLIENT_URL='http://localhost:3000'
gUser=googleEmailAccountUser
gPass=googleEmailAccountPassword
```

# setup db

Before running these commands, a postgres DB should be running locally on port 5432

```
npm i -g sequelize
sequelize db:create
sequelize db:migrate
# create test users, activities, availabilities and relations between them
sequelize db:seed:all
```

# run locally with nodemon

```
npm i -g nodemon
npm run devstart
```