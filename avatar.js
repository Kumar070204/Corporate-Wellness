// server.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
const upload = multer({ dest: "uploads/" });

// Configure environment variables (ensure .env is set up)
const API_KEY = process.env.LIGHTX_API_KEY || "71c22d0ccb984038be331e4537b69155_70fc3abf66d94f7f97aa95cbf0cfcdca_andoraitools";
const AVATAR_URL = "https://api.lightxeditor.com/external/api/v1/avatar";
const STATUS_URL = "https://api.lightxeditor.com/external/api/v1/order-status";

app.use(express.json());

app.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) throw new Error("❌ No image uploaded");
    console.log("Uploaded file:", req.file.path);

    // Upload to Cloudinary (using your original credentials)
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "difzaspdo",
      api_key: process.env.CLOUDINARY_API_KEY || "819247517126118",
      api_secret: process.env.CLOUDINARY_API_SECRET || "DMkOzQ4YmmW155ar8HW3DIqAv1E",
    });

    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      public_id: `avatar-${req.file.filename}-${Date.now()}`,
      resource_type: "image",
    });
    const imageUrl = cloudinaryResult.secure_url;
    console.log("Hosted imageUrl:", imageUrl);
    fs.unlinkSync(req.file.path);

    // Send to LightX API
    const data = {
      imageUrl,
      textPrompt: "pixel art avatar style (retro game look, super cute). Generate from the uploaded face photo, keeping all defining facial features but simplified into a small chibi pixelated face with a large head and child-like proportions. The output should only show the face (not full body).",
      styleImageUrl: "",
    };

    console.log("Sending request to:", AVATAR_URL);
    console.log("Request payload:", data);

    const avatarRes = await fetch(AVATAR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(data),
    });

    console.log("Response Status:", avatarRes.status);
    const responseText = await avatarRes.text();
    console.log("Raw API Response:", responseText || "EMPTY RESPONSE");

    if (!avatarRes.ok) throw new Error(`Avatar API failed: ${avatarRes.status} - ${responseText || "No response body"}`);
    if (!responseText) throw new Error("❌ Empty response from API");

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (jsonErr) {
      throw new Error(`Invalid JSON from API: ${jsonErr.message}`);
    }

    const orderId = result.body?.orderId;
    if (!orderId) throw new Error("❌ No orderId received from API");

    console.log("✅ Order submitted:", orderId);

    // Poll for status
    let avatarUrl = null;
    const maxRetries = 30; // 150 seconds
    for (let i = 0; i < maxRetries; i++) {
      const statusRes = await fetch(STATUS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({ orderId }),
      });

      console.log(`Status Check ${i + 1}/${maxRetries} - Status Response Status:`, statusRes.status);
      const statusText = await statusRes.text();
      console.log("Raw Status Response:", statusText || "EMPTY RESPONSE");

      if (!statusRes.ok) throw new Error(`Status check failed: ${statusRes.status} - ${statusText || "No response body"}`);

      let statusData;
      try {
        statusData = JSON.parse(statusText);
      } catch (jsonErr) {
        throw new Error(`Invalid JSON from status API: ${jsonErr.message}`);
      }

      const body = statusData.body || {};
      if ((body.status === "completed" || body.status === "active") && body.output) {
        avatarUrl = body.output;
        console.log(`✅ Avatar generation complete after ${i + 1} retries`);
        break;
      } else if (body.status === "failed") {
        throw new Error("❌ Avatar generation failed");
      } else {
        console.log(`⏳ Still processing (status: ${body.status || "unknown"})... retrying in 5s`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    if (avatarUrl) {
      res.json({ avatarUrl });
    } else {
      throw new Error(`Timed out waiting for avatar after ${maxRetries} retries`);
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log(`🚀 Server running at http://localhost:3000`);
});