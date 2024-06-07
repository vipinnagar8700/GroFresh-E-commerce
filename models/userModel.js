const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    otp:String,
    // Common user fields
    f_name: String,
    l_name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    referral_code: {
      type: String,
      unique: true,
      default: null,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    address: String,
    city: String,
    state: String,
    refreshToken: String,
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ["Customer", "DeliveryMan","admin","subadmin","Branch","Agent"],
      required: true,
    },
    image: {
      default: null,
      type: String,
    },
    email_verification:{
      default: 0,
      type: Number,
    },
    verification:{
      default: 0,
      type: Number,
    },
    coverage_distance:{
      default: 0,
      type: Number,
    },
    Branch_type:{
      type: String,
      default: null,
    },Branch:{
      type: mongoose.Schema.Types.ObjectId, ref: "Branch" ,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); // Corrected variable name
  console.log("Generated Reset Token:", resetToken);
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};



const User = mongoose.model("User", userSchema);

const CustomerSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Customer-specific fields
    f_name: String,
    l_name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: String,
    city: String,
    state: String,
    image: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    dob: {
      type: String,
      default: null,
    },
    pincode: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const BranchSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    f_name: String,
    l_name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: String,
    city: String,
    state: String,
    image: {
      type: String,
      default: null,
    },
    pincode: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);


const DeliveryManSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    Branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    // Pharmacy-specific fields
    f_name: String,
    l_name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    permission: {
      type: Boolean,
      default: false,
    },
    
    status: {
    type: String,
    enum: ['pending', 'approved', 'blocked'],
    default: 'pending',
  },
    dob: {
      type: String,
      default: null,
    },
    address: String,
    city: String,
    state: String,
    
    image: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    Pincode: {
      type: String,
      default: null,
    },
    country: {
      type: String, 
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const AgentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", CustomerSchema);
const DeliveryMan = mongoose.model("DeliveryMan", DeliveryManSchema);
const Branch = mongoose.model("Branch", BranchSchema);
const Agent = mongoose.model("Agent", AgentSchema);
module.exports = { User, Customer, DeliveryMan ,Branch,Agent};
