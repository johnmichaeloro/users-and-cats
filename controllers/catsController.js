const express = require('express');
const router = express.Router();
const Cat = require('../models/Cat');
const User = require('../models/User');

router.get('/', (req, res)=>{
  //when the controller for cats is activated by a request from the user...
    Cat.find({}, (err, catsFromTheDatabase)=>{
      //This is interesting... maybe it allows you to find a cat?
        res.render('cats/index.ejs', {
          //This is rendering the index.ejs
            catsOnTheTemplate: catsFromTheDatabase
            //this is determining a new varaible for the ejs
        })
    })
})

router.get('/new', (req, res)=>{
  //When a request is made to create a new cat
    User.find({}, (error, allUsers) => {
      //find the user who is making the request
        if(error) {
            res.send(error)
        } else {
            res.render('cats/new.ejs', {
              //render the new cat ejs page
                usersOnTemplate: allUsers
                //determine the variable usersOnTemplate as allUsers
            })
        }
    })

})

router.get('/:id', (req, res) => {
  //When the cats controller receives a request for a specific cat page
    Cat.findById(req.params.id, (err, catFromTheDatabase) => {
      //first find the cat in the database that is referred to in the request
      User.findOne({
        //Then find the user who owns the cat
        "cats": req.params.id
        //the variable cats should refer to the speciied index
      }, (err, user) => {
        res.render('cats/show.ejs', {
          //render the show page for that cat
          catOnTheTemplate: catFromTheDatabase,
          user: user
          //these lines determine the values of the variables on the show page
        });
      })
    })
   })

router.get('/:id/edit', (req, res)=>{
  //when a request is made to edit a specific cat
    Cat.findById(req.params.id, (err, catFromTheDatabase)=>{
      //find that cat by its index in the database
        User.find({}, (err, usersFromTheDatabase)=>{
          //find its user
            res.render('cats/edit.ejs', {
              //render the edit page for that cat
                catOnTheTemplate: catFromTheDatabase,
                usersOnTemplate: usersFromTheDatabase
                //variables displayed on the page
            });
        })

    })
})


router.post('/', (req, res)=>{
  //when a post request is made when adding a new cat
    console.log(req.body);
    //log the contents of the new cat
    Cat.create(req.body, (err, newlyCreatedCat)=>{
      //create the cat accordingly
        console.log(`Created a cat for user ${req.body.userId}`);
        User.findById(req.body.userId, function(err, userFound)
        //update the user accordinly
        {
            userFound.cats.push(newlyCreatedCat._id);
            //push the new cat into the users document
            userFound.save((err, savedUser)=>{
              //save the change
                console.log(savedUser);
                res.redirect('/cats')
                //send the user back to the index page
            });
        });

    })
})

//What is this one?
router.put('/:id', (req, res)=>{
    //when a request is made to edit a cat
    console.log(req.body);
    Cat.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedCat)=>{
      //find that cat and update it accordingly
      User.findOne({'cats': req.params.id}, (err, foundUser) => {
        //update the owner of the cat to reflect the change
        if(foundUser._id.toString() !== req.body.userId){
          //change the user if no longer owner
          foundUser.cats.remove(req.params.id);
          //remove the cat from the user array
          foundUser.save((err, savedFoundUser) => {
            //save the cat to the new user
            User.findById(req.body.userId, (err, newUser) => {
              //find that user
              newUser.cats.push(updatedCat._id);
              //add the cat to their array
              newUser.save((err, savedNewUser) => {
                res.redirect('/cats/' + req.params.id);
                //save and send back to index.ejs
              })
            })
          })
        } else {
          res.redirect('/cats/' + req.params.id)
        }
      })
    });
  });

router.delete('/:id', (req, res)=>{
  //when you want to delete a cat
    Cat.findByIdAndDelete(req.params.id, (err, catFromTheDatabase)=>{
      //find and delete the specific cat
        console.log(catFromTheDatabase);
        res.redirect('/cats');
        //send the user back to the index page
    })
})

router.delete('/:id', (req, res)=>{
  //when you delete a cat
    Cat.findByIdAndDelete(req.params.id, (err, catFromTheDatabase)=>{
      //you find and delete the specific cat
        console.log(catFromTheDatabase);
        User.findOne({'cats': req.params.id}, (err, foundUser)=>{
          //you find its owner
            if(err){
                console.log(err)
            }else{
                console.log(foundUser);
                foundUser.cats.remove(req.params.id);
                foundUser.save((err, updatedUser)=>{
                    console.log(updatedUser);
                    res.redirect('/cats');
                    //you update the user accordinly
                })
            };
        });
    });
});

module.exports = router;
