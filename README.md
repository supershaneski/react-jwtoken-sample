react-jwtoken-sample
================

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Description

This is a simple app to demonstrate how to use JSON Web Token ([JWT](https://jwt.io)) to authenticate/authorize a user.
Initially, the user signs in to the remote server using an API key.
If successful, the remote server will respond that includes a JWT.
The client app will now use this token in every subsequent requests to the remote server.


# Server scripts

I included simple PHP scripts to handle the server-side operation in this project.
Ideally, it would be better to create a Node.JS server app for this.
Maybe I will do it next time.

The JWT is created server side using jwtoken.class.php. 
The class is initialized by the secret key which will be used to sign the token.
The payload is automatically appended with expiration date if the expire variable in token creation is not null.

The token example is timed to expire after 1 hour and the app will handle this case and automatically re-login the user to get fresh token.


## React App Installation
Clone repository and run

```
npm install
```

## Run App
Runs the app in the development mode

```
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
