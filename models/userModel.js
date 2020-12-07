const mongoose = require(`mongoose`);
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name : String,
    email: {
        type: String,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: "default.jpg"
    },
    role: {
        type: String,
        enum: ["user", "admin","test"],
        default: "user",
    },
    birth: {
        type: Number,
        default: 19000101
    },
    gender:String,
    country:String,
    native: String,
    learning: String,
    summary: String,
    hobby: String,
    bookmark: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    room: [
        {
        person: {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
        createdAt: {
                type: Date,
                default: Date.now
            }    
        }
    ],
    password: {
        type: String,
        select: false
    },
    passwordChangedAt: Date,
    jwtToken: String,
    jwtResetExpirea: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        select: false
    }
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
