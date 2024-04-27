const { generateToken } = require("../config/JwtToken");
const {
  User,
  Customer,
  DeliveryMan,Branch,Agent
} = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const nodemailer = require('nodemailer');
require("dotenv/config");


// Register
const register = asyncHandler(async (req, res) => {
  const { f_name, l_name, email, phone, role, password, Branch } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({
      message: "Email is a required field.",
      success: false
    });
  }

  // Check if phone is provided
  if (!phone) {
    return res.status(400).json({
      message: "Phone is a required field.",
      success: false
    });
  }

  // Check if password is provided
  if (!password) {
    return res.status(400).json({
      message: "Password is a required field.",
      success: false
    });
  }

  // Check if a user with the given email or phone already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (!existingUser) {
    // User does not exist, so create a new user
    const newUser = await User.create({
      f_name,
      l_name,
      email,
      phone,
      role,
      password,
      Branch
    });

    // Add role-specific data based on the role
    let roleData;

    if (role === "DeliveryMan") {
      roleData = await DeliveryMan.create({
        user_id: newUser._id,
        f_name: newUser.f_name,
        l_name: newUser.l_name,
        password: newUser.password,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
        Branch: newUser.Branch,
      });
    } else if (role === "Customer") {
      roleData = await Customer.create({
        user_id: newUser._id,
        f_name: newUser.f_name,
        l_name: newUser.l_name,
        password: newUser.password,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
      });
    } else if (role === "Branch") {
      roleData = await Branch.create({
        user_id: newUser._id,
        f_name: newUser.f_name,
        l_name: newUser.l_name,
        password: newUser.password,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
      });
    } else if (role === "Agent") {
      roleData = await Agent.create({
        user_id: newUser._id,
        name: newUser.f_name + " " + newUser.l_name,
        password: newUser.password,
        phone: newUser.phone,
        email: newUser.email,
        role: newUser.role,
      });
    }

    res.status(201).json({
      message: "Agent  created successfully",
      success: true,
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



// Login
const login = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  let findUser;
  // Check if either email or phone is provided
  if (email || phone) {
    findUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
  } else {
    return res.status(400).json({
      message: "Email or phone is required!",
      success: false,
    });
  }

  // Check if a user is found and password matches
  if (findUser && (await findUser.isPasswordMatched(password))) {
    // Generate token and refresh token
    const token = generateToken(findUser._id);
    const refreshToken = generateRefreshToken(findUser._id);

    // Update user's refresh token
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      { refreshToken: refreshToken },
      { new: true }
    );

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send success response
    res.status(200).json({
      message: "Successfully Login!",
      token: token,
      success: true,
    });
  } else {
    // Send failure response if user not found or password does not match
    res.status(401).json({
      message: "Invalid Credentials!",
      success: false,
    });
  }
});


// Me api data by token get
const Userme = async (req, res) => {
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

// All Users 
const AllUsers_role = async (req, res) => {
  try {
    const patients = await User.find().select("-password").populate({
      path: "Branch",
      populate: {
        path: "user_id"
      }
    }).sort({ createdAt: -1 }); // Exclude the 'password' field;
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

// All DeliveryMan
const AllDeliveryMan = async (req, res) => {
  try {
    const patients = await DeliveryMan.find().select("-password").populate('user_id').sort({ createdAt: -1 }); // Exclude the 'password' field;
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
    const patients = await Customer.find().select("-password").populate('user_id').sort({ createdAt: -1 }); // Exclude the 'password' field;
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

// Single USer data
const editUser = async (req, res) => {
  const { id } = req.params;
  try {
    const editUser = await Customer.findOne({ user_id: id }); // Exclude the 'password' field
    if (!editUser) {
      res.status(200).json({
        message: "User was not found!",
        status: false
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

// UpdateUsers data
const UpdateUsers = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Assuming you send the updated data in the request body
  const file = req.file;

  if (file) {
    try {
      // Store image locally in the public directory
      const imageUrl = 'images/' + file.filename;
      updateData.image = imageUrl;
    } catch (error) {
      console.error('Error storing image locally:', error);
      // Handle the error appropriately
    }
  }

  delete updateData.role;

  try {
    const finding = await Customer.findOne({ user_id: id });
    if (!finding) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const editUser = await Customer.findByIdAndUpdate(finding._id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      message: "Data successfully updated",
      success: true,
      data: editUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update data",
      status: false,
    });
  }
};

// DeleteUsers Data
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
        message: "User was not found!", success: false,
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

// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const resetToken = req.params.resetToken;
  console.log(resetToken, "AAA")
  const { oldPassword, newPassword, confirmPassword } = req.body;
  console.log(oldPassword, newPassword, confirmPassword, "AAA")
  try {
    // Find the user by the reset token
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() }, // Check if the token is still valid
    });
    console.log(resetToken, "AAA")
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token", status: false });
    }

    // Check if the old password is correct
    const isOldPasswordCorrect = await user.isPasswordMatched(oldPassword);

    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Old password is incorrect", status: false });
    }

    // Check if the new password and confirmation match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirmation do not match", status: false });
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
    res.json({ message: "Password reset successful", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ResetPassword
const ResetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
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

    res.status(200).json({ message: 'Password reset email sent successfully', status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', status: false });
  }
})

// New Password
const New_password = asyncHandler(async (req, res) => {
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

    res.status(200).json({ message: 'Password reset successful', status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', status: true });
  }
})




module.exports = {
  register,
  login,
  AllUsers,
  editUser,
  UpdateUsers,
  deleteUser,
  changePassword, ResetPassword, New_password, AllUsers_role, Userme,AllDeliveryMan
};
