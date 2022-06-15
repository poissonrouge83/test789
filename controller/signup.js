const express = require('express');
const User = require('../model/user');
bcrypt = require ('bcrypt');

class Signup{
    constructor() {
        this.message = '';
    }
    
    option(){
        return { 
            title: 'Inscription', 
            contact: {
                number: "0601079455",
                mail: ''
            },
            textError: '',
            message: this.message
        };
    }

    alreadyExisting(req, res){
        let bool = new Boolean(true);
        const test1 = User.findOne({ username: req.body.username }).then((user) => {
            if (user) {
                bool = Boolean(false);
                // req.flash('error_msg','username Already Exists');
                res.redirect('/signup');
            }
        });
        const test2 = User.findOne({ mail: req.body.mail }).then((user) => {
            if (user) {
                bool = Boolean(false);
                // req.flash('error_msg','mail Already Exists');
                res.redirect('/login');
            }
        });
        return bool;
    }

    newUser(req, res){  
        User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10),
            mail: req.body.mail,
            number: req.body.number,
            adress: req.body.adress,
            adressSup: req.body.adressSup,
            postalCode: req.body.postalCode,
            city: req.body.city,
            role: "user"
        })
            .then(() => console.log("user save success"))
            .then(() => this.message = "Inscription terminé")
            .then(() => res.redirect("signup"))
            .catch(err => { res.status(500).send({ message: err.message }); });



///////////////////////////////////////////////////////////////
        // const newUser = new User({
        //     username: req.body.username,
        //     password: req.body.password,
        //     mail: req.body.mail,
        //     number: req.body.number,
        //     adress: req.body.adress,
        //     adressSup: req.body.adressSup,
        //     postalCode: req.body.postalCode,
        //     city: req.body.city
        // });
        
        // //this.alreadyExisting(req, res);
        // this.saveUser(newUser);
        
        // res.redirect('/signup');

        //this.signupValidation(req, res, newUser.makeModel());

        //valider format        => middleware? services ?
        //verifier username dans la base de donnée
        //saveUser(user);
    }

    signupValidation(req, res, newUser){

        User.register(newUser, req.body.password, (err, user)=>{
            if(err){
                // req.flash('error', err.message);
                return res.redirect('/signup');
            }
                //Authentification
                passport.authenticate('local')(req, res, (err, newUser)=>{
                    if(err){
                        // req.flash('error', err.message)
                        return res.redirect('/signup');
                    }
                    // req.flash('success', 'cool you are connected!');
                    return res.redirect('/');
                })

        
        })
    }

    saveUser(user){
        user.save()
            .then(() => console.log("user save success"))
            .catch((err) => console.log("user save fail", err));
    }
}

module.exports = Signup