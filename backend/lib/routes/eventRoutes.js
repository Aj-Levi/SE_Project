import express from "express";
import Event from "../models/Event.js"; // adjust the path if needed
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
const router = express.Router();

router.get("/tags", async (req, res) => {
  try {
    const tags = await Event.distinct("coreInfo.eventTags");
    res.json(tags.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: "Error fetching tags", error: err });
  }
});

router.get("/countries", async (req, res) => {
  try {
    const countries = await Event.distinct("coreInfo.country");
    res.json(countries.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: "Error fetching countries", error: err });
  }
});

router.post("/search", async (req, res) => {
  try {
    const { query, countries, tags, startingDate, endingDate } = req.body; // Changed from req.query to req.body
    const filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { summary: { $regex: query, $options: "i" } },
        { "coreInfo.eventName": { $regex: query, $options: "i" } }, // Added eventName search
      ];
    }

    if (countries && Array.isArray(countries) && countries.length > 0) { // Handle array directly
      filter["coreInfo.country"] = { $in: countries };
    }

    if (tags && Array.isArray(tags) && tags.length > 0) { // Handle array directly
      filter["coreInfo.eventTags"] = { $in: tags };
    }

    if (startingDate && endingDate) {
      const start = new Date(startingDate);
      const end = new Date(endingDate);
      // Check if the event's date range overlaps with the search range
      filter.$and = [
        {
          $or: [
            { "coreInfo.startingDate": { $lte: end } },
            { "coreInfo.startingDate": { $exists: false } }
          ]
        },
        {
          $or: [
            { "coreInfo.endDate": { $gte: start } },
            { "coreInfo.endDate": { $exists: false } },
            { "coreInfo.startingDate": { $gte: start, $lte: end } }
          ]
        }
      ];
    } else if (startingDate) {
      // Only start date provided - find events that start after this date
      const start = new Date(startingDate);
      filter["coreInfo.startingDate"] = { $gte: start };
    } else if (endingDate) {
      // Only end date provided - find events that end before this date
      const end = new Date(endingDate);
      filter["coreInfo.endDate"] = { $lte: end };
    }

    const events = await Event.find(filter, "title summary coreInfo views") // Added views to projection
      .sort({ "coreInfo.startingDate": 1 })
      .lean();

    res.json(events);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Error searching events", error: err.message });
  }
});

router.get("/by-date", async (req, res) => {
  try {
    const { country, date } = req.query;

    if (!country || !date) {
      return res.status(400).json({ error: "Country and date are required" });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const events = await Event.find({
      "coreInfo.country": { $regex: country, $options: "i" },
      "coreInfo.startingDate": { $lte: targetDate },
      "coreInfo.endDate": { $gte: targetDate },
    }).select("title summary coreInfo");

    res.json(events);
  } catch (error) {
    console.error("Error fetching events by date:", error);
    res.status(500).json({ error: "Failed to fetch events by date" });
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Missing id param" });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id format" });
    }

    const event = await Event.findById(id).lean();
    if (!event) return res.status(404).json({ error: "Event not found" });

    return res.json(event);
  } catch (err) {
    console.error("Error fetching event by id:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/featuredEvents", async (req, res) => {
  try {
    const events = await Event.find({}).sort({ views: -1 }).limit(5).lean();

    res.json(events);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching featured events", error: err });
  }
});

router.post("/inc_views", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({
      message: "View count incremented successfully",
      views: updatedEvent.views,
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ error: "Failed to increment view count" });
  }
});

router.post("/gemini-bullets", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }

    // Fetch the event from database
    const event = await Event.findById(id).lean();
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create prompt for bullet points generation
    const prompt = `
      Based on the following historical event, generate exactly 10 bullet points that summarize the key aspects, causes, consequences, and significance of this event. Return only a JSON array of strings, where each string is a bullet point. Do not include any other text, formatting, or explanations.

      Event Title: ${event.title || ""}
      Event Summary: ${event.summary || ""}
      Event Description: ${event.description || ""}
      Country: ${event.coreInfo?.country || ""}
      Start Date: ${event.coreInfo?.startingDate || ""}
      End Date: ${event.coreInfo?.endDate || ""}
      Tags: ${event.coreInfo?.eventTags?.join(", ") || ""}

      Generate 10 concise and informative bullet points as a JSON array of strings.
    `;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let bulletPoints = response.text();

    // Try to parse the response as JSON
    try {
      // Clean the response to extract JSON array
      bulletPoints = bulletPoints.trim();
      if (bulletPoints.startsWith("```json")) {
        bulletPoints = bulletPoints
          .replace(/```json\n?/, "")
          .replace(/\n?```$/, "");
      }
      if (bulletPoints.startsWith("```")) {
        bulletPoints = bulletPoints
          .replace(/```\n?/, "")
          .replace(/\n?```$/, "");
      }

      const parsedBullets = JSON.parse(bulletPoints);

      if (Array.isArray(parsedBullets) && parsedBullets.length > 0) {
        // Ensure we have at most 10 bullet points
        const finalBullets = parsedBullets.slice(0, 10);
        res.json(finalBullets);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // Fallback: try to extract bullet points manually
      const lines = bulletPoints.split("\n").filter((line) => line.trim());
      const fallbackBullets = lines
        .filter(
          (line) =>
            line.includes("•") || line.includes("-") || line.includes("*")
        )
        .map((line) => line.replace(/^[\s•\-\*]+/, "").trim())
        .filter((line) => line.length > 0)
        .slice(0, 10);

      if (fallbackBullets.length > 0) {
        res.json(fallbackBullets);
      } else {
        res.status(500).json({ error: "Failed to generate bullet points" });
      }
    }
  } catch (error) {
    console.error("Error generating bullet points:", error);
    res.status(500).json({ error: "Failed to generate bullet points" });
  }
});

export default router;
