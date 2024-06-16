const mongoose = require('mongoose');
const bcrypt= require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
      type: String,
      required: true
    },
    age:{
        type: Number,

    },
    mobile:{
        type: String,
       
    },
    email:{
        type: String,
        
    },
    address:{
        type:String,
        required: true
    },
    aadharCardNumber:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['voter','admin'],
        default: 'voter'
    },
    isVoted:{
        type:Boolean,
        default: false
    }
});

userSchema.pre('save',async function(next){
    const person = this;

    if(!person.isModified('password')) return next();

    try{

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(person.password,salt);

        person.password = hashedPassword;
        next();
    }
    catch(err)
    {
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(CandidatePassword){
    try{
          const isMatch = await bcrypt.compare(candidatePasssowrd,this.password);
          return isMatch;
    }catch(err)
    {
        throw err;
    }
}

const User= mongoose.model('User',userSchema);
module.exports = User;
