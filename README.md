## The friendbook app:

### Backend:

The backend is written with Node js + Typescript to add types -- to allow for easier maintainance and development.

It has Express server as server; Express is the most popular server framework in Node js. Its usage of middlewares makes it easy to use and customize.

The express server serves a user route that allows to simple creation, logging in a user, getting a user's friends, update of user's profile, making friend requests, accepting friend requests, and logging out of user.

The server uses the Postgres with Sequelize ORM. The Sequelize makes it easy to define database models that provide type support in the editor environment. It also makes it easy to encapsulate complex queries.

<hr>

### Frontend

#### Framework

Considering a social media site might want to be searchable from search engines <b>some day</b>, the frontend is built with Next 13 with the app directory. Next 13 introduces a new way to implement React 18's server components. Even though right now users need to login to see the users on the network.

#### UI

On top, tailwind is used to add styling to the app. Tailwind makes it easy to configure overall app design -- theme colors, spacing, typography etc.. It also reduces the amount of css you need to write which makes development easier and less, if not none stylesheet to maintain.

#### Data fetching

useSWR is used to perform 90% of the data fetching. useSWR saves you from having to using multiple hooks `useEffect`, `useState`, to handling data fetching and handling the result and error. More importantly, useSWR helps implement client-side caching -- it serves data fetching result from previously stored cache, while revalidating it in the background -- which in turns provides a better user experience.

#### Form validation

Considering there are no complex form validation logic in this app, form validation is handled by util functions written in simple JavaScript to check if required fields are submitted. For more complex form validation, `react-hook-form` is a good package to use. It uses `ref` to validate input, which prevent unnecessary re-renders.

<hr>

### Running the project

#### Pre-requisites:

You will need to have Docker installed on your machine.

<hr>

#### Running the app

To run the client and the backend, you will need to have node 16>, redis, pgadmin, installed on your machine. To save you the hassel of installing all the depenedies to run this app. You can just run the whole application in a few commands with docker. Following list the instructions:

1. Set up a network for the backend and frontend of this app to communicate on from:

```
docker network create -d bridge my-bridge-network
```

2. To by default, fake users will be created for you. If you would like to turn that off, change the environment variable in `docker-compose.yml` in the `faceboot` folder.

3. Start the backend and frontend with docker

```
docker-compose -f ./faceboot/docker-compose.yml up -d --build && docker-compose -f ./client/docker-compose.yml up -d --build
```
