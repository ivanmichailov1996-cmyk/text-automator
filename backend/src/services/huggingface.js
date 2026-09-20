// AI Text Generation using Hugging Face Inference API
import axios from 'axios';

const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2/api/text-generation';

// Create axios instance with timeout
const hfClient = axios.create({
  timeout: 30000,
  headers: {
    'Authorization': `Bearer ${HF_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const generateTask = async (description) => {
  try {
    const prompt = `You are a task management assistant. Based on the following description, generate a clear, structured work task for an employee.

Description: ${description}

Provide response in this format:
**Task Title:** [Clear, concise title]
**Objective:** [Main goal]
**Requirements:** [List of key requirements]
**Deadline:** [Suggested timeline]
**Success Criteria:** [How to measure success]`;

    return await generateText(prompt);
  } catch (error) {
    console.error('Task generation error:', error);
    throw error;
  }
};

export const generateLetter = async (topic, points, tone = 'formal') => {
  try {
    const toneInstructions = {
      formal: 'Use professional, business language',
      friendly: 'Use warm, approachable tone',
      firm: 'Use direct, assertive language'
    };

    const prompt = `Write a professional letter on the following:

Topic: ${topic}
Key Points to Cover: ${points}
Tone: ${toneInstructions[tone] || 'professional'}

Format as a complete business letter with proper structure.`;

    return await generateText(prompt);
  } catch (error) {
    console.error('Letter generation error:', error);
    throw error;
  }
};

export const rewriteText = async (text, level = 'medium') => {
  try {
    const levelInstructions = {
      light: 'Make minor improvements to grammar and clarity',
      medium: 'Rewrite to improve flow, clarity, and engagement',
      heavy: 'Completely rephrase with different sentence structure and vocabulary'
    };

    const prompt = `Rewrite the following text. ${levelInstructions[level] || 'Improve clarity'}

Original text:
${text}

Rewritten text:`;

    return await generateText(prompt);
  } catch (error) {
    console.error('Text rewrite error:', error);
    throw error;
  }
};

export const generatePost = async (topic, platform = 'telegram') => {
  try {
    const platformInstructions = {
      telegram: 'Concise, engaging, suitable for Telegram (max 2000 chars)',
      instagram: 'Visual-focused, hashtags, emoji, max 2200 chars',
      linkedin: 'Professional, insightful, B2B focused'
    };

    const prompt = `Create a social media post for ${platform}.

Topic: ${topic}
Guidelines: ${platformInstructions[platform] || 'engaging and relevant'}

Post:`;

    return await generateText(prompt);
  } catch (error) {
    console.error('Post generation error:', error);
    throw error;
  }
};

export const generateText = async (prompt) => {
  try {
    console.log('Generating text with Hugging Face API...');

    // Call Hugging Face Inference API
    const response = await hfClient.post(HF_API_URL, {
      inputs: prompt,
      parameters: {
        max_length: 150,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
        repetition_penalty: 1.2
      }
    });

    // Extract and clean the generated text
    if (response.data && response.data[0] && response.data[0].generated_text) {
      let generatedText = response.data[0].generated_text;

      // Remove the original prompt from the output
      if (generatedText.startsWith(prompt)) {
        generatedText = generatedText.substring(prompt.length);
      }

      // Clean up and return
      const cleanedText = generatedText.trim();
      return cleanedText || 'Unable to generate content';
    }

    return 'Unable to generate content';
  } catch (error) {
    console.error('Text generation error:', error.message);

    // Provide helpful error message
    if (error.message.includes('DNS') || error.message.includes('ENOTFOUND')) {
      throw new Error('API connection failed - DNS issue. Please try again in a moment.');
    }

    if (error.response?.status === 503) {
      throw new Error('Hugging Face API is busy. Please try again in a moment.');
    }

    throw error;
  }
};

export default {
  generateTask,
  generateLetter,
  rewriteText,
  generatePost,
  generateText
};
