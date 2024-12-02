import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-purple-800 via-indigo-900 to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl">
        <div className="text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 p-4 rounded-full shadow-lg">
              <Wand2 className="w-14 h-14 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-gray-100 mb-4">
            Website Builder AI
          </h1>
          <p className="text-lg text-gray-300">
            Unleash your creativity! Describe your dream website, and we'll help
            you build it in no time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 transition transform hover:scale-105">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="w-full h-40 p-4 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:ring-4 focus:ring-purple-500 focus:border-transparent resize-none placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-gray-100 rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Generate Website Plan
          </button>
        </form>
      </div>
    </div>
  );
}
