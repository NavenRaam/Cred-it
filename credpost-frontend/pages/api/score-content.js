import { getServerSession } from "next-auth/next";
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  // Expecting headline and description separately from the frontend
  const { headline, description } = req.body;

  if (!headline || typeof headline !== 'string' || !description || typeof description !== 'string') {
    return res.status(400).json({ success: false, message: 'Headline and description are required and must be strings.' });
  }

  let finalCredibilityScore = 0; // Initialize final score
  const errors = []; // To capture any errors during API calls

  // --- Call Gemini API for Credibility and Relevance Score ---
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      errors.push('Gemini API key not configured.');
      console.error('GEMINI_API_KEY environment variable is not set.');
      // If API key is missing, we cannot proceed with Gemini scoring
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Gemini API key is missing.',
        errors: errors,
      });
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

    // Prompt to get both credibility score and headline-content relevance
    const prompt = `Analyze the following article for its credibility and the relevance of its headline to the main content.
    Provide a JSON object with two fields:
    1. 'credibilityScore': A number between 0 (highly unreliable/misleading) and 1 (highly reliable/factual) for the article's content.
    2. 'isHeadlineRelevant': A boolean (true if the headline accurately and fairly reflects the content, false otherwise).

    Example Output:
    {
      "credibilityScore": 0.85,
      "isHeadlineRelevant": true
    }

    Headline: "${headline}"
    Content: "${description}"`;

    const geminiPayload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json", // Request JSON structured output
        // You can add temperature or topK/topP here if needed for creative control
      },
    };

    console.log('Calling Gemini API...');
    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload),
    });

    if (geminiResponse.ok) {
      const geminiResult = await geminiResponse.json();
      const geminiJsonText = geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (geminiJsonText) {
        try {
          const parsedGeminiData = JSON.parse(geminiJsonText);
          let rawGeminiCredibilityScore = parsedGeminiData.credibilityScore;
          const isHeadlineRelevant = parsedGeminiData.isHeadlineRelevant;

          if (typeof rawGeminiCredibilityScore === 'number' && rawGeminiCredibilityScore >= 0 && rawGeminiCredibilityScore <= 1 && typeof isHeadlineRelevant === 'boolean') {
            console.log('Raw Gemini Credibility Score:', rawGeminiCredibilityScore);
            console.log('Is Headline Relevant:', isHeadlineRelevant);

            // Apply 5% reduction
            let adjustedGeminiScore = rawGeminiCredibilityScore * 0.95;

            // Apply penalty if headline is not relevant
            if (!isHeadlineRelevant) {
              adjustedGeminiScore = adjustedGeminiScore * 0.5; // Example: Halve the score if not relevant
              errors.push('Headline is not relevant to the content, score penalized.');
              console.warn('Headline not relevant, score penalized.');
            }

            finalCredibilityScore = parseFloat(adjustedGeminiScore.toFixed(2)); // Keep to 2 decimal places
            console.log('Final Credibility Score (after adjustments):', finalCredibilityScore);

          } else {
            errors.push(`Gemini API returned invalid data format or values: ${geminiJsonText}`);
            console.error('Gemini API returned unparseable or invalid data:', geminiJsonText);
          }
        } catch (jsonParseError) {
          errors.push(`Failed to parse Gemini API JSON response: ${jsonParseError.message}`);
          console.error('JSON Parse Error for Gemini response:', jsonParseError);
        }
      } else {
        errors.push('Gemini API response missing content.');
        console.error('Gemini API response structure unexpected:', geminiResult);
      }
    } else {
      const errorData = await geminiResponse.json();
      errors.push(`Gemini API Error (${geminiResponse.status}): ${errorData.error.message || 'Unknown error'}`);
      console.error('Gemini API Response Not OK:', geminiResponse.status, errorData);
    }
  } catch (error) {
    errors.push(`Gemini API Fetch Error: ${error.message}`);
    console.error('Network or Fetch Error calling Gemini API:', error);
  }

  // If no valid score could be obtained, return an error
  if (finalCredibilityScore === 0 && errors.length > 0) { // Only if initialized to 0 and errors occurred
    return res.status(500).json({
      success: false,
      message: 'Failed to obtain a valid credibility score from Gemini.',
      errors: errors,
    });
  }

  // --- Return Combined Score ---
  res.status(200).json({
    success: true,
    credibilityScore: finalCredibilityScore,
    details: {
      geminiMlScore: finalCredibilityScore, // Now this is the adjusted Gemini score
      errors: errors.length > 0 ? errors : undefined,
    },
  });
}
