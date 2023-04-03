# Simulation Game for Algorithm Trading

Simulation Game for Algorithm Trading is a trading simulation game designed for users to test their trading strategies using real-world financial data. This README file provides instructions for installation and usage of the application.

## Installation

1. Ensure that you have installed the latest version of Node.js and NPM on your local machine.
2. Clone this repository to your local machine using Git:

```
git clone [repository URL]
```

### Server Installation

1. Navigate to the server directory and install the server dependencies using NPM:

```
cd server
npm install
```

2. Create a `.env` file or change the `.env.example` file in the server directory and fill it with the following information:


```
PORT=[port number] (e.g. 3000)
MONGO_PW=[MongoDB password]
MONGO_DB_NAME=[MongoDB database name]
HOST=[host name] (e.g. localhost)
JWT_KEY=[JWT secret key] (e.g. myjwt)
POLYGON_KEY=[Polygon API key]
```



You can obtain a MongoDB password and database name by signing up for a [Cloud MongoDB account](https://www.mongodb.com/). <br>
To obtain a Polygon API key, you can sign up on the [Polygon.io website](https://polygon.io/).

3. Run the server using NPM:


```
npm start
```

4. To run unit tests:

```
npm test
```



### Web Application Installation

To use the web application, follow these steps:

1. Navigate to the web_app directory and install the dependencies using NPM:

```
cd web_app
npm install
```


2. Open the `.env` file in `web_app/.env` and set the `REACT_APP_SERVER_HOST` variable to the target server host, for example:

```
REACT_APP_SERVER_HOST=http://localhost:3000
```

3. Run the React app using NPM:

```
npm start
```

This will launch the web application in your browser. 

## Usage

Once the server and web application are running, you can navigate to the URL specified in your browser to begin using the application. The application provides a trading simulation environment where users can create trading algorithms and backtest them using real-world financial data. The game includes features such as buying and selling stocks, crypto, and visualizing trading results. 

Good luck and have fun trading!


