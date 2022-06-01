const express = require('express');
const app = express();
const mongoose = require('mongoose');


const userData = require('./usersData');

var currentLoggedInUser = '';

app.use(express.json());
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/TweetDB', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => { console.error(error.message) });
db.once('open', () => { console.log("Connected!") }); 

// Routers
// const usersRouter = require('./routes/usersRoutes');
// const tweetsRouter = require('./routes/tweetsRoutes');

// app.use('/users', usersRouter);
// app.use('/tweets', tweetsRouter);


const Users = require('./Models/Users');

app.get('/', (req, res) =>{
    res.render('pages/index')
})

app.get('/signup', (req, res) => {
    res.render('pages/signup');
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})


// for all users
app.get('/Users',
	async(req, res) => {
		try {
			const resultData = await Users.find();
			res.json({
				success: true,
				data: resultData
			});
		} catch (error) {
			console.log(error);
			res.json({
				success: false
			});
		}
	});

// For single user 
app.get('/User/:username',
	async(req, res) => {
		try {
			const resultData = await Users.find({ UserName: {$eq: req.params.username} });
            if(resultData[0]){
                res.json({
                    success: true,
                    data: resultData
                });
                currentLoggedInUser = resultData[0];
            }else{
                res.json({
                    success: false
                });

            }
		} catch (error) {
			console.log(error);
		}
	});


app.post('/Users',
	async(req, res) => {
		const user = new Users({
            Email: req.body.Email,
            Password: req.body.Password,
            DisplayName: req.body.DisplayName,
			UserName: req.body.UserName,
			Bio: req.body.Bio
		});

		try {
			const newUser = await user.save();
			res.json(newUser);
		} catch (error) {
			console.log(error);
		}
	});


const Tweets = require('./Models/Tweet');
const req = require('express/lib/request');
app.get('/Tweets',
	async(req, res) => {

		try {
            const tweetsAndUserObj = {};

			const resultData = await Tweets.find();
            
            tweetsAndUserObj.resultData = resultData;
            tweetsAndUserObj.UserName = "currentLoggedInUser";

            res.render('pages/tweets', {tweetsAndUserObj});

		} catch (error) {
			console.log(error);
			res.json({
				success: false
			});
		}
	});

app.post('/Tweets',
	async(req, res) => {

        const currentAuthor = userData[Math.floor(Math.random()*userData.length)];

		const tweet = new Tweets({
			author: currentLoggedInUser,
			textContent: req.body.textContent,
			likes: 0
		});

		try {
			const newTweet = await tweet.save();
			res.json(newTweet);
		} catch (error) {
			console.log(error);
		}
	});

app.patch('/Tweets/liked/:id',
	async(req, res) => {
		try {
			
             const targetTweet = await Tweets.findById(req.params.id);
             targetTweet.likes = parseInt(targetTweet.likes) + 1;
             const oneTweet = await targetTweet.save();

            // const oneTweet = await Tweets.updateOne({ _id: req.params.id }, { $set: { likes:  Math.floor(Math.random()*9999) } });
            res.json(oneTweet);
		} catch (error) {
			console.log(error);
		}
	});

    app.put('/Tweets/edit/:id',
	async(req, res) => {
		try {
			
             const targetTweet = await Tweets.findById(req.params.id);
             targetTweet.textContent = req.body.textContent;
             const oneTweet = await targetTweet.save();

            // const oneTweet = await Tweets.updateOne({ _id: req.params.id }, { $set: { likes:  Math.floor(Math.random()*9999) } });
            res.json(oneTweet);
		} catch (error) {
			console.log(error);
		}
	});


app.delete('/Tweets/Delete/:id',
	async (req, res) => {
		try {

			const targetTweet = await Tweets.findById(req.params.id);
			//targetTweet.likes = parseInt(targetTweet.likes) + 1;
			//const oneTweet = await targetTweet.save();

			 await Tweets.deleteOne({ _id: req.params.id });


			res.json(targetTweet);
		} catch (error) {
			console.log(error);
		}
    });



app.listen(3000,
	() =>
	console.log('Server is running on port 3000!')
);

