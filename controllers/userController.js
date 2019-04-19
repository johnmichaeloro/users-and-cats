const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cat = require('../models/Cat');

router.get('/', (req, res)=>{
  //when the user page is requested
    User.find({}, (err, usersFromTheDatabase)=>{
      //find the users in the database
        res.render('users/index.ejs', {
          //render the user index.ejs
            usersOnTheTemplate: usersFromTheDatabase
            //determines the varaibles to be displayed on the ejs template
        })
    })
})

router.get('/new', (req, res)=>{
  //when a new user is requested
    res.render('users/new.ejs');
    //render the new.ejs for new users
})

router.get('/:id', (req, res)=>{
  //when a specific user page is requested
    User.findById(req.params.id)
    //find that particular user in the db
    .populate('cats')
    //populate their cats
    .exec((err, userFromTheDatabase)=>{
        if(err){
            res.send(err);
        } else {
            res.render('users/show.ejs', {
                userOnTheTemplate: userFromTheDatabase
                //render the show page with this varaible
            });
        }

    })
})

router.get('/:id/edit', (req, res)=>{
  //When a request is made to edit a user
    User.findById(req.params.id, (err, userFromTheDatabase)=>{
      //find that user in the db
        res.render('users/edit.ejs', {
          //render the edit page
            userOnTheTemplate: userFromTheDatabase
            //display this variable
        })
    })
})

router.post('/', (req, res)=>{
  //when a new user is created
    User.create(req.body, (err, newlyCreatedUser)=>{
      //create that user
        console.log(newlyCreatedUser)
        res.redirect('/users')
        //send user back to index.ejs
    })
})

router.put('/:id', (req, res)=>{
  //when a change is made to a user
    User.findByIdAndUpdate(req.params.id, req.body, (err, userFromTheDatabase)=>{
      //find and update that user
        console.log(userFromTheDatabase);
        res.redirect('/users');
        //send user back to index.ejs
    })
})

router.delete('/:id', (req, res)=>{
  //when a request is made to delete a user
    User.findByIdAndDelete(req.params.id, (err, userFromTheDatabase)=>{
      //find that user and delete
        console.log(userFromTheDatabase);
        Cat.deleteMany({
          //delete the cats associated with that user
            _id: {
                $in: userFromTheDatabase.cats
            }
        }, (err, data)=>{
            console.log(data);
            res.redirect('/users');
            //send user back to user index.ejs
        })
    })
})

module.exports = router;
