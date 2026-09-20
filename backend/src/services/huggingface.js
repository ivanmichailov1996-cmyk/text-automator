// AI Text Generation using Transformers.js for local inference
import { pipeline } from '@xenova/transformers';

// Initialize the text generation pipeline (will download model on first use)
let textGenerationPipeline = null;

async function getTextPipeline() {
  if (!textGenerationPipeline) {
    console.log('Initializing text generation pipeline...');
    textGenerationPipeline = await pipeline('text-generation', 'Xenova/distilgpt2');
  }
  return textGenerationPipeline;
}

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
    console.log('Generating text with Transformers.js...');

    const generator = await getTextPipeline();

    // Generate text with MINIMAL parameters for Render free tier (512MB RAM limit)
    // Using very small token count to avoid memory issues
    const result = await generator(prompt, {
      max_new_tokens: 50,  // Reduced from 150 to 50 tokens
      temperature: 0.5,
      top_p: 0.9,
      do_sample: false,    // Disable sampling for faster generation
      repetition_penalty: 1.1
    });

    // Extract and clean the generated text
    if (result && result[0] && result[0].generated_text) {
      let generatedText = result[0].generated_text;

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
    if (error.message.includes('ONNX') || error.message.includes('Memory') || error.message.includes('out of memory')) {
      throw new Error('Model loading failed - server memory exceeded on free tier. Trying again...');
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
