// AI Text Generation using Hugging Face models
// Note: This uses Transformers.js for local inference

export const generateTask = async (description) => {
  try {
    const prompt = `
Task: Based on the following description, generate a clear, structured work task for an employee.

Description: ${description}

Format the response as:
**Task Title:** [Clear, concise title]
**Objective:** [Main goal]
**Requirements:** [List of key requirements]
**Deadline:** [Suggested timeline]
**Success Criteria:** [How to measure success]
    `;

    // Simulated response (in production, use actual LLM)
    return generateText(prompt);
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

    const prompt = `
Write a professional letter on the following:

Topic: ${topic}
Key Points to Cover: ${points}
Tone: ${toneInstructions[tone] || 'professional'}

Format as a complete business letter with proper structure.
    `;

    return generateText(prompt);
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

    const prompt = `
Rewrite the following text. ${levelInstructions[level] || 'Improve clarity'}

Original text:
${text}

Rewritten text:
    `;

    return generateText(prompt);
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

    const prompt = `
Create a social media post for ${platform}.

Topic: ${topic}
Guidelines: ${platformInstructions[platform] || 'engaging and relevant'}

Post:
    `;

    return generateText(prompt);
  } catch (error) {
    console.error('Post generation error:', error);
    throw error;
  }
};

export const generateText = async (prompt) => {
  try {
    // Simulated AI response
    // In production, integrate with actual LLM API or local model

    // For now, return a reasonable placeholder
    const responses = [
      "✨ Generated content based on your request. In production, this would be powered by Hugging Face Transformers.js or an LLM API.",
      "🤖 AI-generated response ready. Connect to a real LLM model for production use.",
      "📝 Content generated successfully. Configure your LLM endpoint in production."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  } catch (error) {
    console.error('Text generation error:', error);
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
