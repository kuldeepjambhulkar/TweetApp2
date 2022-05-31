const express = require('express');
const app = express();
const mongoose = require('mongoose');

const userData = require('./usersData');

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


app.post('/Users',
	async(req, res) => {
		const user = new Users({
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
			const resultData = await Tweets.find();
			// res.json({
			// 	success: true,
			// 	data: resultData
			// });

            res.render('pages/tweets', {resultData});

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
			author: currentAuthor,
			textContent: req.body.textContent,
			likes: req.body.likes
		});

		try {
			const newTweet = await tweet.save();
			res.json(newTweet);
		} catch (error) {
			console.log(error);
		}
	});

app.patch('/Tweets/liked',
	async(req, res) => {
		try {
			const oneTweet = await Tweets.updateOne({ _id: req.body._id }, { $set: { likes:  14 } });
			res.json(oneTweet);
		} catch (error) {
			console.log(error);
		}
	});



app.listen(3000, () =>
	console.log('Server is running on port 3000!')
)

