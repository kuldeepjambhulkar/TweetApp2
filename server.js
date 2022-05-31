const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())



mongoose.connect('mongodb://localhost/TweetDB', {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => {console.error(error.message)})
db.once('open', () => {console.log("Connected!")})

// Routers
// const usersRouter = require('./routes/usersRoutes');
// const tweetsRouter = require('./routes/tweetsRoutes');

// app.use('/users', usersRouter);
// app.use('/tweets', tweetsRouter);








const users = require('./models/users')



app.get('/users', async(req, res)=> {
    try{
        const resultData = await users.find(); 
        res.json({
            success: true,
            data: resultData
        })
    }catch(error){
        console.log(error);
        res.json({
            success: false,
        })
    }
})


app.post('/users', async(req, res)=> {
    const user = new users({
        DisplayName: req.body.DisplayName,
        UserName:req.body.UserName,
        Bio: req.body.Bio
    })

    try{
        const newUser = await user.save();
        res.json(newUser);
    }catch(error){
        console.log(error);
    }
})




const tweets = require('./models/tweet')

app.get('/tweets', async(req, res)=>{
    
    try{
        const resultData = await tweets.find(); 
        res.json({
            success: true,
            data: resultData
        })
    }catch(error){
        console.log(error);
        res.json({
            success: false,
        })
    }
})

app.post('/tweets', async(req, res)=> {

    const tweet = new tweets({
        author: req.body.author,
        textContent:req.body.textContent,
        likes: req.body.likes
    })

    try{
        const newtweet = await tweet.save();
        res.json(newtweet);
    }catch(error){
        console.log(error);
    }
})

app.patch('/tweets/liked', async(req, res)=>{
    try{
        
        const oneTweet = await tweets.updateOne({_id: req.body._id}, {$set:{likes: req.body.likes}});
        res.json(oneTweet);
    }catch(error){
        console.log(error);
    }
})



app.listen(3000, () =>
  console.log('Server is running on 3000!'),
)