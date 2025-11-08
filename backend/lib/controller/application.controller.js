import Application from "../models/Application.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
export const generate=async(req,res)=>{
    try {
        
    
    const {event}=req.body
    const applicantId = req.id; // set by isAuth middleware

    if (!applicantId) {
      return res.status(401).json({ message: "Unauthorized: no user found", success: false });
    }

    if (!event ) {
      return res.status(400).json({ message: "Event data missing", success: false });
    }
    const newApp = new Application({
      applicant: applicantId,
      event
    });

    await newApp.save();
    

    return res.status(201).json({
      message: "Application submitted successfully",
      success: true,
      application: newApp,
    });
    } catch (error) {
        console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
 
    }
}

// VALIDATE APPLICATIONS

export const validate = async (req, res) => {
  try {
    const { id } = req.params; // application ID
    const { status, score } = req.body; // expected: status = "accepted" or "rejected"

    // Find the application
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found", success: false });
    }

    // Check if valid status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value", success: false });
    }

    // If accepted
    if (status === "accepted") {
      // 1️⃣ Create a new event
      const newEvent = new Event(application.event);
      await newEvent.save();

      // 2️⃣ Update the user's score & contributions
      const user = await User.findById(application.applicant);
      if (user) {
        user.score = (user.score || 0) + (score || 0); // add score
        user.contributions = (user.contributions || 0) + 1; // increment contribution count
        await user.save();
      }

      // 3️⃣ Update the application status
      application.status = "accepted";
      await application.save();

      return res.status(200).json({
        message: "Application accepted, event created, and user rewarded successfully",
        success: true,
        event: newEvent,
        user: {
          id: user._id,
          name: user.name,
          newScore: user.score,
          totalContributions: user.contributions,
        },
      });
    }

    // If rejected
    if (status === "rejected") {
      application.status = "rejected";
      await application.save();

      return res.status(200).json({
        message: "Application rejected successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error("Error in validate:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


//GET ALL APPLICATIONS 
export const getApplications = async (req, res) => {
  try {
    // Optional: only allow admin access
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Access denied: admin only" });
    }

    // Fetch and populate applicant details
    const applications = await Application.find()
      .populate("applicant", "name email role")
      .lean();

    // Group applications by status
    const grouped = {
      pending: [],
      accepted: [],
      rejected: []
    };

    applications.forEach(app => {
      grouped[app.status].push(app);
    });

    // Prepare counts
    const counts = {
      pending: grouped.pending.length,
      accepted: grouped.accepted.length,
      rejected: grouped.rejected.length
    };

    // Send final response
    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      counts,
      applications: grouped
    });

  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};