After installing the project, you should create a .env file, which I did not include here. 

.env file should include 

NODE_ENV=development
DB_NAME="db name"
DB_USER="db user "
DB_HOST="host"
DB_DRIVER=postgres
DB_PASSWORD="password"
DB_URI=postgres://"dbuser":"password"@localhost:"port"/"dbname"
JWT_SECRET=mysecretJWTtoken

After adjusting.env file, you should run npm install command in the terminal 
Then you should use migration commands ; 

 npx sequelize-cli db:migrate command is for migration and npx sequelize-cli db:migrate:undo:all is for undoing the migration. 

After running npx sequelize-cli db:migrate command you can start the application using; 

npm start command

If you like to run tests, please stop the application, undo all migrations using  npx sequelize-cli db:migrate:undo:all then migrate again with npx sequelize-cli db:migrate 
after that, you can run  npm test command 

Make sure to do this every time after running tests, otherwise it will cause problems. Reason for this is i dont use a different database for testing. 



