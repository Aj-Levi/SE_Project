import express from "express";
import Event from "../models/Event.js"; // adjust the path if needed
import mongoose from "mongoose";        
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

router.get("/search", async (req, res) => {
  try {
    const { query, countries, tags, startingDate, endingDate } = req.query;
    const filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { summary: { $regex: query, $options: "i" } }
      ];
    }

    if (countries) {
      const list = countries.split(",").map(c => c.trim());
      filter["coreInfo.country"] = { $in: list };
    }

    if (tags) {
      const list = tags.split(",").map(t => t.trim());
      filter["coreInfo.eventTags"] = { $in: list };
    }

    if (startingDate && endingDate) {
      const start = new Date(startingDate);
      const end = new Date(endingDate);
      filter["coreInfo.startingDate"] = { $gte: start, $lte: end };
    }

    const events = await Event.find(filter, "title summary coreInfo")
      .sort({ "coreInfo.startingDate": 1 })
      .lean();

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error searching events", error: err });
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
      "coreInfo.country": country,
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


export default router;
