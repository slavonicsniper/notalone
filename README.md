# notalone
web app to find a buddy for an activity

# setup db

```
echo "dbConnectionString='postgres://<dbUser>:<dbPassword>@localhost:5432/notalone'" >> .env
npm i -g sequelize
sequelize db:create
sequelize db:migrate
```