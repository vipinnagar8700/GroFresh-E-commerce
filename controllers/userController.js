const { generateToken } = require("../config/JwtToken");
const {
  User,
  Customer,
  DeliveryMan,
} = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require("dotenv/config");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require('uuid');
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});




const register = asyncHandler(async (req, res) => {
  const { f_name, l_name, email, mobile, phone, role, referral_code,password } = req.body;
  // Check if a user with the given email or phone already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (!existingUser) {
    // User does not exist, so create a new user
    const newUser = await User.create({
      f_name, l_name, email, mobile, phone, role,password
    });

    // Generate the password reset token
    await newUser.createPasswordResetToken();

    // Save the user with the generated token
    await newUser.save();

    // Add role-specific data based on the role
    let roleData;

    if (role === "DeliveryMan") {
      roleData = await DeliveryMan.create({
        user_id: newUser._id,
        f_name: newUser.f_name,
        l_name: newUser.l_name,
        password: newUser.password, // Assuming this is the password from newUser
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,

      });
    } else if (role === "Customer") { // Corrected from else (role === "Customer")
      roleData = await Customer.create({
        user_id: newUser._id,
        f_name: newUser.f_name,
        l_name: newUser.l_name,
        password: newUser.password, // Assuming this is the password from newUser
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
      });
    }

    res.status(201).json({
      message: "Successfully Registered!",
      success: true,
      data: newUser
    });
  } else {
    // User with the same email or phone already exists
    const message =
      existingUser.email === email
        ? "Email is already registered."
        : "Mobile number is already registered.";
    res.status(409).json({
      message,
      success: false,
    });
  }
});





const login = asyncHandler(async (req, res) => {
  const { email, phone, password,role } = req.body;

  let findUser;
  // Check if a user with the given email or mobile exists and matches the role
  if (role) {
    findUser = await User.findOne({
      $and: [{ $or: [{ email }, { phone }] }],
    });
  } else {
    findUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
  }


  if (findUser && (await findUser.isPasswordMatched(password))) {
    const token = generateToken(findUser._id);
    const refreshToken = generateRefreshToken(findUser._id);
    const updateUser = await User.findByIdAndUpdate(
        findUser._id,
        {
            refreshToken: refreshToken,
        },
        { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // const response = {
    //     token: token,
    // };
    // if (findUser.role === "Customer") {
    //     response.CustomerData = await Customer.findOne({ user_id: findUser._id });
    // } else if (findUser.role === "DeliveryMan") {
    //     response.DeliveryManData = await DeliveryMan.findOne({ user_id: findUser._id });
    // }
    // Send notification

    res.status(200).json({
        message: "Successfully Login!",
        token: token,
        success: true,
    });
} else {
    res.status(401).json({
        message: "Invalid Credentials!",
        success: false,
    });
}

});

const Userme =async(req,res)=>{
try {
   // Extract the user ID from the authenticated token
   const userId = req.user.userId;

   // Query the User table to find the user by ID
   const user = await User.findById(userId);

   if (!user) {
       return res.status(404).json({ message: 'User not found' });
   }

   // If user is found, return the user data
   res.json({ user });
} catch (error) {
  res.status(500).json({ message: error.message });
}
}


const AllUsers_role = async (req, res) => {
  try {
    const patients = await User.find().select("-password").sort({ createdAt: -1 }); // Exclude the 'password' field;
    const length = patients.length;
    res.status(200).json([
      {
        message: "All Users data retrieved successfully!",
        data: patients,
        status: true,
        length,
      },
    ]);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};

const AllUsers = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password").sort({ createdAt: -1 }); // Exclude the 'password' field;
    const length = patients.length;
    res.status(200).json([
      {
        message: "All Users data retrieved successfully!",
        data: patients,
        status: true,
        length,
      },
    ]);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};


const editUser = async (req, res) => {
  const { id } = req.params;
  try {
    const editUser = await Patient.findOne({ user_id: id }); // Exclude the 'password' field
    if (!editUser) {
      res.status(200).json({
        message: "User was not found!",
        status:false
      });
    } else {
      res.status(201).json({
        message: "Data successfully Retrieved!",
        success: true,
        data: editUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve Data!",
      status: false,
    });
  }
};
// Multer configuration

const UpdateUsers = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Assuming you send the updated data in the request body
  const file = req.file;

if (file) {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'LifeCareSolution', // Optional: You can specify a folder in your Cloudinary account
            resource_type: 'auto', // Automatically detect the file type
        });

        updateData.image = result.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        // Handle the error appropriately
    }
}

const domain = 'https://viplifecaresolution.onrender.com';

// Replace backslashes with forward slashes and remove leading './'
const relativePath = file.path.replace(/\\/g, '/').replace(/^\.\//, '');

// Construct the full image URL
const imageUrl = `${domain}/${relativePath}`;

console.log(imageUrl);

  delete updateData.role;

  try {



    const finding = await  Patient.findOne({user_id:id})
    console.log(finding)

    const editUser = await Patient.findByIdAndUpdate(finding._id, updateData, {
      new: true,
    }).select("-password");

    if (!editUser) {
      res.status(200).json({
        message: "User was not found!",
      });
    } else {
      res.status(201).json({
        message: "Data successfully updated!",
        success: true,
        data: editUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update data!",
      status: false,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(200).json({
        message: "User was not found!",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin users cannot be deleted.",
        status: false,
      });
    }

    // If the user is not an admin, proceed with the deletion
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(200).json({
        message: "User was not found!",      success: false,
      });
    } else {
      return res.status(201).json({
        message: "Data successfully deleted!",
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete data!",
      status: false,
    });
  }
};




const changePassword = asyncHandler(async (req, res) => {
  const resetToken = req.params.resetToken;
  console.log(resetToken,"AAA")
  const { oldPassword, newPassword, confirmPassword } = req.body;
  console.log( oldPassword, newPassword, confirmPassword ,"AAA")
  try {
    // Find the user by the reset token
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() }, // Check if the token is still valid
    });
console.log(resetToken,"AAA")
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token",status:false });
    }

    // Check if the old password is correct
    const isOldPasswordCorrect = await user.isPasswordMatched(oldPassword);

    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Old password is incorrect",status:false });
    }

    // Check if the new password and confirmation match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirmation do not match",status:false });
    }

    // Update the user's password
    user.password = newPassword;
    user.passwordChangeAt = new Date(); // Update the password change timestamp
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // Save the updated user
await user.createPasswordResetToken();

    // Save the updated user
    await user.save();
    res.json({ message: "Password reset successful",status:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


const ResetPassword = asyncHandler(async(req,res)=>{
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found',     success: false });
    }

    // Create and save password reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save();

    // Create a nodemailer transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'bonnie.olson0@ethereal.email',
        pass: 'Nu9vPVh1wmyvuMzzpM'
    }
    });

    // Compose the email message
    const mailOptions = {
      from: 'bonnie.olson0@ethereal.email',
      to: 'vipinnagar8700@gmail.com',
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:3000/reset/${resetToken}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent successfully' ,status:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error',status:false });
  }
})


const New_password = asyncHandler(async(req,res)=>{
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  // Check if the new password matches the confirmation
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirmation do not match' });
  }

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful',status:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error',status:true });
  }
})

const payment = asyncHandler(async(req,res)=>{
  try {
    
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error',status:true });
  }
})

module.exports = {
  register,
  login,
  AllUsers,
  editUser,
  UpdateUsers,
  deleteUser,
  changePassword,ResetPassword,New_password,payment,AllUsers_role,Userme
};
