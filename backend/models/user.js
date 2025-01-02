const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
      validate: {
        validator: function(password) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
        },
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }
    },
    role: {
      type: String,
      enum: {
        values: ['doctor', 'store', 'civilian'],
        message: '{VALUE} is not a valid role'
      },
      default: 'civilian'
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function(v) {
          return /\d{10}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    accountLocked: {
      type: Boolean,
      default: false
    },
    lockUntil: {
      type: Date
    },
    resetToken: String,
    resetTokenExpiry: Date,
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ resetToken: 1 }, { sparse: true });
userSchema.index({ emailVerificationToken: 1 }, { sparse: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

userSchema.methods = {
  comparePassword: async function(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw new Error(error);
    }
  },

  generateResetToken: function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.resetTokenExpiry = Date.now() + 30 * 60 * 1000; 
    return resetToken;
  },

  generateEmailVerificationToken: function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; 
    return verificationToken;
  },

  incrementLoginAttempts: async function() {
    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts >= 5) {
      this.accountLocked = true;
      this.lockUntil = Date.now() + 30 * 60 * 1000; 
    }

    await this.save();
  },

  resetLoginAttempts: async function() {
    this.failedLoginAttempts = 0;
    this.accountLocked = false;
    this.lockUntil = undefined;
    await this.save();
  }
};

userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isActive: this.isActive,
    isEmailVerified: this.isEmailVerified,
    phoneNumber: this.phoneNumber,
    address: this.address
  };
});

userSchema.virtual('isLocked').get(function() {
  return this.accountLocked && this.lockUntil > Date.now();
});

userSchema.statics = {
  findByEmailWithPassword: function(email) {
    return this.findOne({ email }).select('+password');
  },
  
  findActiveByRole: function(role) {
    return this.find({ role, isActive: true });
  }
};

module.exports = mongoose.model('User', userSchema);
