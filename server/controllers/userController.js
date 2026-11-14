import User from "../models/User.js";

// GET /api/user/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user profile.",
    });
  }
};

// PUT /api/user/update (Optional update profile endpoint from PDF)
export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;

    if (!fullName || typeof fullName !== "string" || !/^[A-Za-z ]{3,}$/.test(fullName.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid full name (minimum 3 characters, letters and spaces only).",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    user.fullName = fullName.trim();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile.",
    });
  }
};
