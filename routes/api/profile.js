const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { ProfilingLevel } = require('mongodb');

router.get('/me',auth ,async(req,res) => {
    try{
    const profile = await Profile.findOne({user:req.user.id})
    .populate('user', ['name', 'avatar']);

    if(!profile){
        return res.status(400).json({msg:'There is no profile for this user'});

    }

    res.json(profile);
    }catch(err){
    console.error(err.message);
    res.status(500).send('server error')
    }



});

router.post('/',[auth,[
    check('status', 'Status is required')
    .not()
    .isEmpty(), 
    check('skills', 'skills is required')
    .not()
    .isEmpty()
    ]],
async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})

    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
        } = req.body;

    const profileFields ={};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(skills) {
        profileFields.skills= skills.split(',').map(skill => skill.trim());

    }

    profileFields.social ={}
     if(youtube) profileFields.youtube = youtube;
    if(twitter) profileFields.twitter = twitter;
    if(facebook) profileFields.facebook = facebook;
    if(linkedin) profileFields.linkedin = linkedin;
    if(instagram) profileFields.instagram = instagram;

    try {
        let profile = Profile.findOne({user: req.user.id});

        if(profile){
            profile = await Profile.findOneAndUpdate({user: req.user.id},
        
        {user: req.user.id},
        {$set:profileFields},
        {new:true}

        );

        return res.json(profile);
        }


        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile)
    } catch(error){
        console.error(err.message);
        res.status(500).send('Server Error')

    }

    console.log(profileFields.skills);

    res.send('Hello');


})

module.exports = router; 