
// OpenAI API service for content generation
import { AIPrompt, AIResponse } from "@/types";

// OpenAI API endpoint
const OPENAI_API_URL = "https://api.openai.com/v1/completions";

/**
 * Sends a prompt to OpenAI API and returns the generated content
 * @param prompt The user's content generation prompt
 * @returns AIResponse object with generated content
 */
export const getOpenAIResponse = async (prompt: AIPrompt): Promise<AIResponse> => {
  const { industry, tone, audience } = prompt;
  
  // Create a detailed prompt for the AI
  const detailedPrompt = `
    Generate social media content for the ${industry} industry.
    Use a ${tone} tone of voice.
    Target audience: ${audience || "general audience"}.
    
    Please provide:
    1. Five post ideas related to ${industry} with a ${tone.toLowerCase()} approach
    2. Three social media captions (for LinkedIn, Facebook, and Twitter)
    3. Five relevant hashtags for ${industry} and ${tone} content
  `;

  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key is not provided. Please set the VITE_OPENAI_API_KEY environment variable.");
    }
    
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using a more modern model as davinci is deprecated
        prompt: detailedPrompt,
        max_tokens: 750,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response from OpenAI");
    }
    
    const data = await response.json();
    
    // Parse the OpenAI response text into our AIResponse format
    // This is a simplistic parser - in production you might want to use a more robust solution
    // or have OpenAI return JSON directly with function calling
    const responseText = data.choices[0].text.trim();
    
    // Process the response text to extract post ideas, captions, and hashtags
    const postIdeas = extractPostIdeas(responseText);
    const captions = extractCaptions(responseText);
    const hashtags = extractHashtags(responseText);
    
    return {
      postIdeas,
      captions,
      hashtags
    };
    
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate content with OpenAI");
  }
};

/**
 * Extract post ideas from OpenAI response text
 */
const extractPostIdeas = (text: string): string[] => {
  // Basic extraction - in production you'd want more robust parsing
  const ideasPattern = /post ideas(.*?)(?=captions|hashtags|$)/is;
  const match = text.match(ideasPattern);
  
  if (match && match[1]) {
    return match[1]
      .split(/\d+\./)
      .filter(line => line.trim().length > 0)
      .map(idea => idea.trim())
      .slice(0, 5); // Limit to 5 ideas
  }
  
  // Fallback: If parsing fails, return generic post ideas
  return [
    "Industry trends and insights",
    "Behind-the-scenes look at our processes",
    "Customer success story spotlight",
    "Tips and best practices for professionals",
    "Upcoming events and announcements"
  ];
};

/**
 * Extract captions from OpenAI response text
 */
const extractCaptions = (text: string): { linkedin: string; facebook: string; twitter: string } => {
  // Default captions in case extraction fails
  const defaultCaptions = {
    linkedin: "We're excited to share our latest insights on industry trends. #ProfessionalDevelopment",
    facebook: "Check out our newest update! We'd love to hear your thoughts. 💬",
    twitter: "New post alert! Click the link to learn more about how we're innovating in our industry."
  };
  
  try {
    // Extract LinkedIn caption
    const linkedinMatch = text.match(/linkedin.*?:(.*?)(?=facebook|twitter|hashtags|$)/is);
    const linkedin = linkedinMatch && linkedinMatch[1]?.trim() || defaultCaptions.linkedin;
    
    // Extract Facebook caption
    const facebookMatch = text.match(/facebook.*?:(.*?)(?=linkedin|twitter|hashtags|$)/is);
    const facebook = facebookMatch && facebookMatch[1]?.trim() || defaultCaptions.facebook;
    
    // Extract Twitter caption
    const twitterMatch = text.match(/twitter.*?:(.*?)(?=linkedin|facebook|hashtags|$)/is);
    const twitter = twitterMatch && twitterMatch[1]?.trim() || defaultCaptions.twitter;
    
    return { linkedin, facebook, twitter };
  } catch (error) {
    console.error("Error extracting captions:", error);
    return defaultCaptions;
  }
};

/**
 * Extract hashtags from OpenAI response text
 */
const extractHashtags = (text: string): string[] => {
  // Look for hashtags section
  const hashtagsPattern = /hashtags(.*?)$/is;
  const match = text.match(hashtagsPattern);
  
  if (match && match[1]) {
    return match[1]
      .split(/\n|,/)
      .map(tag => tag.trim())
      .filter(tag => tag.startsWith('#') || tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag.replace(/\s+/g, '')}`)
      .slice(0, 5); // Limit to 5 hashtags
  }
  
  // Fallback hashtags
  return [
    "#IndustryInsights",
    "#ProfessionalTips",
    "#BestPractices",
    "#Innovation",
    "#BusinessGrowth"
  ];
};
