require("dotenv").config();
import express from "express";
import { OpenAI } from "openai";  // Import OpenAI SDK
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import cors from "cors";

// Initialize OpenAI API key
const API_KEY = process.env.ANTHROPIC_API_KEY;  // Replace with your OpenAI API key
const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: "http://127.0.0.1:8080/v1",  // Use OpenAI API base URL
});

const app = express();
app.use(cors());
app.use(express.json());

// Define the /template endpoint
app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;

    try {
        // Call OpenAI API with the user input prompt
        const response = await openai.chat.completions.create({
            model: "mistral-large-2411",  // Specify OpenAI model
            max_tokens: 200,
            messages: [
                {
                    role: "system",
                    content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const answer = response.choices[0]?.message?.content?.trim();  // Extract response content

        // Send appropriate response based on answer
        if (answer === "react") {
            res.json({
                prompts: [
                    BASE_PROMPT,
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [reactBasePrompt],
            });
        } else if (answer === "node") {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [nodeBasePrompt],
            });
        } else {
            res.status(403).json({ message: "You can't access this" });
        }
    } catch (error) {
        console.error("Error processing the request:", error);

        // Handle the error properly: Narrow the type of `error`
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});

// Define the /chat endpoint
app.post("/chat", async (req, res) => {
    const messages = req.body.messages;

    try {
        // Generate a response from OpenAI API
        const response = await openai.chat.completions.create({
            model: "mistral-large-2411",  // Specify OpenAI model
            max_tokens: 12000,
            messages: messages,
        });

        console.log(response);

        res.json({
            response: response.choices[0]?.message?.content,
        });
    } catch (error) {
        console.error("Error processing the chat request:", error);

        // Handle the error properly: Narrow the type of `error`
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
