// AI Text Generation using Hugging Face Inference API
import axios from 'axios';

const HF_API_TOKEN = process.env.HF_API_TOKEN;
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

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
    if (!HF_API_TOKEN) {
      throw new Error('HF_API_TOKEN environment variable is not set');
    }

    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Extract generated text from response
    if (Array.isArray(response.data)) {
      const generatedText = response.data[0]?.generated_text || '';
      // Remove the prompt from the generated text (Mistral includes it)
      return generatedText.replace(prompt, '').trim() || 'Unable to generate content';
    }

    return response.data?.generated_text || 'Unable to generate content';
  } catch (error) {
    console.error('Hugging Face API error:', error.message);

    // Fallback response if API fails
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timeout - model might be loading. Please try again in a moment.');
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
