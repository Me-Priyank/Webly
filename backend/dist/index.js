"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const openai_1 = require("openai"); // Import OpenAI SDK
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const cors_1 = __importDefault(require("cors"));
// Initialize OpenAI API key
const API_KEY = process.env.ANTHROPIC_API_KEY; // Replace with your OpenAI API key
const openai = new openai_1.OpenAI({
    apiKey: API_KEY,
    baseURL: "http://127.0.0.1:8080/generate", // Use OpenAI API base URL
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Define the /template endpoint
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const prompt = req.body.prompt;
    try {
        // Call OpenAI API with the user input prompt
        const response = yield openai.chat.completions.create({
            model: "mistral-large-2411", // Specify OpenAI model
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
        const answer = (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim(); // Extract response content
        // Send appropriate response based on answer
        if (answer === "react") {
            res.json({
                prompts: [
                    prompts_1.BASE_PROMPT,
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [react_1.basePrompt],
            });
        }
        else if (answer === "node") {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [node_1.basePrompt],
            });
        }
        else {
            res.status(403).json({ message: "You can't access this" });
        }
    }
    catch (error) {
        console.error("Error processing the request:", error);
        // Handle the error properly: Narrow the type of `error`
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
}));
// Define the /chat endpoint
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const messages = req.body.messages;
    try {
        // Generate a response from OpenAI API
        const response = yield openai.chat.completions.create({
            model: "mistral-large-2411", // Specify OpenAI model
            max_tokens: 12000,
            messages: messages,
        });
        console.log(response);
        res.json({
            response: (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content,
        });
    }
    catch (error) {
        console.error("Error processing the chat request:", error);
        // Handle the error properly: Narrow the type of `error`
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
}));
// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
