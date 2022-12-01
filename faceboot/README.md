### Backend:

The backend is written with Node js + Typescript to add types -- to allow for easier maintainance and development.

It has Express server as server; Express is the most popular server framework in Node js. Its usage of middlewares allows for a flexible and powerful system -- middlewares can be used independently, or be used to extend the functionalities of another middleware.

The express server extends several routes through the `/user` route that allows to simple creation, logging in a user, getting a user's friends, update of user's profile, making friend requests, accepting friend requests, and logging out of user.

The server uses the Postgres with Sequelize ORM. Sequelize has over 100k downloads per week, and has large community support. Sequelize is convenient to use -- it allows you to define database models with type support. With the ability to define models as a `class`, you can define methods to encapsulate complex queries. 
