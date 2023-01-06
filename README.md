# Limsamaatti-connections 0.1

Limsamaatti-connections is the serve-side half of a larger Limsamaatti-project that also includes the project Limsamaatti. Simple Express.js, PostgreSQL Server which works in tandem with the Limsamaatti frontend to save/delete/update/get user and product data through the server. 

The application is being made to give a digital avenue for Cluster to track their members soda purchases and allowing the person responsible for the selling to track the purchases 

Project was done using JavaScript and its React.js framework

## Installation

Download this project from the repository

Download Node.js from [Nodejs.org](https://nodejs.org/en/download/)

Navigate to the project directory and give the command:
```bash
npm install
```
which will install all the project dependencies.

The project also requires as PostgreSQL database. For this I recommend downloading [PgAdmin4](https://www.pgadmin.org/download/)

Current configuration for the database as can be seen in /public/javascripts/DatabaseManage.js is:
![image](https://user-images.githubusercontent.com/3331182/211118527-4a0b9918-cf75-4714-93a5-35b4e3d37e2d.png)

The Database requires 4 tables that have the following setups:
![image](https://user-images.githubusercontent.com/3331182/211118635-5c2ffc7a-ca5a-4b6a-9fdb-5b0e22458254.png)
![image](https://user-images.githubusercontent.com/3331182/211118650-b3aa27b4-42d7-4149-a11b-645969ed39e0.png)
![image](https://user-images.githubusercontent.com/3331182/211118674-4bd1e438-4c8e-4d5a-b66c-61421d91a2a8.png)
![image](https://user-images.githubusercontent.com/3331182/211118699-0de61779-f8f0-41e6-ab6e-8ef063977040.png)

The privaledges will be changed once admin functionality is added and the sveeping privaledges will be removed from all execpt from the Admin of the database

## Usage
Using Node.js command prompt installed when downloading Node.js, navigate to the directory where Limsamaatti-connections is and start the project by 
```node.js
npm start

```
or if you wish modify the project
```node.js
nodemon /bin/www

```


## Upcoming changes
For the project still has plenty to do, so for the frontend-backend functionality, the following are still required:
- Tests for the databases
- a logger which would log all actions server-side to either the database or a separate document
- Product functionality for saving and updating products
- A function for initializing database upon starting the server if there isn't database yet


## License

[MIT](https://choosealicense.com/licenses/mit/)
