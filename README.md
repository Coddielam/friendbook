## The friendbook app:

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
### Using the app:

1. **Visit the app on browser:** To access the app, go to `localhost:3000` on your browser. 

2. **Registering an account** You will be greeted with a login page. Since you don't have an account, you will have to click on **Create an account** to create an account first. Once registration is complete, you will be redirected to the home page 

3. **Add a friend:** You can send friend request to the one you want to befriend with. 

4. **Approve the request:** Say you have sent request to John Doe with email **john_doe@email.com**. To approve the request, log out by clicking on 🚪. And login with **john_doe@email.com** with password `12341234`. (All fake users on this network uses the password `12341234`). <br>* *Dont worry you can log into their account, they don't mind. They are fake.* *

5. **Accept request:** Once you have logged in to that account, you will see a notification on 🌍. Click it and approve the friend request. 

6. **View profile:** Go to your profile by clicking your icon on the top right. You will see your friends on the right panel. You can also update your password here. 

7. **Viewing other user's profile:** Go to home page, click on the profile picture of any user, you will see their profile and their friends. 


