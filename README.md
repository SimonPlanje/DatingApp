# 💘 Liking feature
Hi there!
Welcome to my Dating repository. In this repository you will find out how I made the liking feature for a datingapp using NodeJS.
![Likepage](https://user-images.githubusercontent.com/63976685/85265025-eb49ae00-b471-11ea-8535-a9e8dd4330e3.PNG)
After this feature is completed we are going to make full dating app of it by adding the features other studenst made. If you want to checkout the endresult checkout this [repository](https://github.com/Vuurvos1/projectTechGroup/blob/master/README.md)

When I stated of with my feature I wanted to cover one specific problem people could have in these times of Corona so I made thet following jobstory to start the project off with. Checkout [the Wiki](https://github.com/SimonPlanje/DatingApp/wiki) to see the choices I made and the researsch I have done more in Depth.

### 📚 Jobstory
When I am bored during the Corona period and am in the need of social contact with like minded people, I want to be able to quickly find these like minded people so I can start a conversation with them and talk about our shared interests.

### 👷 Build with

- NodeJS
- EJS
- MongoDB
- NPM packages

### 🧰 Installation
All of the content in this github repository is build from scratch with Node and vanilla javascript, I used mongodb so I can interact with a real and live database. 
So for the installation you will have to follow a few steps to get everything to work. 

1. Make sure [NodeJS and NPM](https://www.npmjs.com/get-npm) are installed locally.
1. Clone the files from the github repo and put them in an empty local file on your pc. \
```
git clone https://github.com/SimonPlanje/DatingApp.git
```
2. Open your Terminal/CMD and navigate to to the map where you pasted the copy of the repo in.
```
cd file/youwantogoto
```
3. Now it is time to get this feature working, follow these following steps to get it to work.

This npm installation is required because this project contains a lot of the npm packages, without these packages this code will not work.
Type the following into your termial to install the npm packages:
```js
npm install
```

### 🚪 setting up the database
1. Go to [mongoDB](https://www.mongodb.com/) and login or create an account
2. Create a new database
3. Add a collection to this database called **users**
4. Create a new global file in the just cloned code called **.env**
5. add the following lines into the .env file:  
```
  DB_NAME=_name of database you created_ 
  DB_LINK=_link to mongodb database (can be found in mongoDB at the **connect** tab, make sure to get the url string right!)_ 
  SES_SECRET=session secret
  ```
  
  ### 🚂 Starting the server 
  
Now the server should start without any issues. 
To start the server type the following into your terminal:
```js
npm run dev
```

Let check if the feature is up and running. 
The server will by default be running on the localhost 1000;
Type the the following into you browser search bar:
```js
http://localhost:1000
```
If you run into any problem feel free to [leave an issue](https://github.com/SimonPlanje/DatingApp/issues) in the top navigation bar of this repo!
