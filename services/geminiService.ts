
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Tool } from "@google/genai";
import { GenerationOptions } from "../types";

// Initialize the client
// CRITICAL: We use process.env.API_KEY as per strict guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates or Transforms an SVG string based on the user's prompt and options.
 * Uses 'gemini-3-pro-preview' for generation.
 */
export const generateSvgFromPrompt = async (options: GenerationOptions): Promise<string> => {
  const { 
    mode, 
    prompt, 
    stylePrompt, 
    animationPrompt, 
    sourceSvg, 
    images, 
    urls, 
    useSearch,
    resolution 
  } = options;

  try {
    const isTransform = mode === 'transform';
    
    // Define the core persona and task
    let systemPrompt = `
      You are a world-class expert in Scalable Vector Graphics (SVG) design and coding. 
      ${isTransform 
        ? 'Your task is to RECONSTRUCT and UPGRADE an existing SVG based on new specifications (Dialectical Transformation).' 
        : 'Your task is to generate a high-quality, visually stunning, and detailed SVG based on the user\'s description.'}
      
      Guidelines:
      1.  **Output Format**: Return ONLY the raw SVG code. Do not wrap it in markdown code blocks (e.g., no \`\`\`xml). Do not add any conversational text.
      2.  **Quality**: Use gradients, proper pathing, distinct colors, and clean code.
      3.  **Technical Constraints**:
          - ALWAYS set the \`width\` to "${resolution.width}" and \`height\` to "${resolution.height}".
          - ALWAYS include a \`viewBox\` attribute matching these dimensions (or appropriate aspect ratio).
          - Ensure the SVG is self-contained.
          - Use semantic IDs.
      4.  **Environment Limitations (CRITICAL)**:
          - This SVG is rendered via React's 'dangerouslySetInnerHTML'.
          - **<script> tags are NOT executed** by the renderer. Do not rely on them.
          - **DO NOT define or call custom functions** (e.g., \`onclick="playRoar()"\` will CRASH).
          - If you need interactions/sounds:
            *   Use **CSS** (\`:hover\`, \`:active\`, \`@keyframes\`) or **SMIL** (\`<animate>\`) for visuals. This is preferred.
            *   For Audio: You MAY embed an \`<audio>\` tag inside a \`<foreignObject>\` (or hidden) with an ID.
            *   To trigger audio: Use standard inline DOM methods ONLY: e.g., \`onclick="document.getElementById('my-audio-id').play()"\`.
            *   NEVER write \`onclick="customFunction()"\`.
    `;

    if (animationPrompt) {
      systemPrompt += `
      5.  **Specific Animation/Functional Specs**:
          - Requirement: "${animationPrompt}"
          - Implement this strictly adhering to the "Environment Limitations" above.
      `;
    }

    // Build the content parts
    const parts: any[] = [];

    let fullPrompt = "";

    if (isTransform) {
      // --- TRANSFORMATION PROMPT STRUCTURE ---
      fullPrompt += `CONTEXT: Dialectical Transformation (Improvement of existing material).\n`;
      fullPrompt += `SOURCE SVG (THESIS): \n${sourceSvg || 'No source provided (Create from scratch based on prompt)'}\n\n`;
      fullPrompt += `TRANSFORMATION GOALS (ANTITHESIS):\n${prompt}\n`;
    } else {
      // --- CREATION PROMPT STRUCTURE ---
      fullPrompt += `OBJECT DESCRIPTION: "${prompt}"\n`;
    }

    // Common Parameters
    if (stylePrompt) {
      fullPrompt += `VISUAL STYLE: "${stylePrompt}"\n`;
    } else if (!isTransform) {
      fullPrompt += `VISUAL STYLE: Modern, clean, flat art or material design.\n`;
    }

    if (animationPrompt) {
      fullPrompt += `FUNCTIONAL/ANIMATION SPECS: "${animationPrompt}"\n`;
    }
    
    fullPrompt += `REQUIRED RESOLUTION: ${resolution.width}x${resolution.height} pixels.\n`;

    if (urls.length > 0) {
      fullPrompt += `\nREFERENCE CONTEXT/URLS:\n${urls.join('\n')}`;
      fullPrompt += `\n(Use the information from these sources to inform the design/content).`;
    }

    fullPrompt += `\nACTION: Generate the ${isTransform ? 'transformed' : 'new'} SVG code now.`;
    
    parts.push({ text: fullPrompt });

    // Add images if present
    if (images.length > 0) {
      images.forEach(img => {
        // SAFETY: Skip SVG mime types if they accidentally got here, as the API will reject them.
        if (img.mimeType === 'image/svg+xml') return;

        parts.push({
          inlineData: {
            data: img.data,
            mimeType: img.mimeType
          }
        });
      });
    }

    // Configure Tools
    const tools: Tool[] = [];
    if (useSearch) {
      tools.push({ googleSearch: {} });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemPrompt,
        temperature: isTransform ? 0.3 : 0.4, // Lower temp for transformation to stick to structure
        topP: 0.95,
        topK: 40,
        tools: tools.length > 0 ? tools : undefined,
      },
    });

    const rawText = response.text || '';
    
    return cleanResponse(rawText);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate SVG.");
  }
};

/**
 * Refines an existing SVG based on dialectical synthesis instructions (Aufhebung).
 * This is for the 'quick refine' bar at the bottom of the preview.
 */
export const refineSvg = async (currentSvg: string, instruction: string): Promise<string> => {
  try {
    const systemPrompt = `
      You are an SVG Architect practicing "Dialectical Aufhebung".
      Your goal is to preserve the positive elements of the current SVG while resolving its contradictions based on the user's critique.
      
      Task:
      1. Analyze the provided SVG code (Thesis).
      2. Apply the user's modification instruction (Antithesis).
      3. Generate the new SVG code (Synthesis).
      
      Constraints:
      - Output ONLY the raw SVG code.
      - Maintain valid SVG syntax.
      - IMPORTANT: Do NOT define custom functions (e.g. script tags). Use CSS/SMIL or inline standard DOM API calls only.
    `;

    const parts = [
      { text: `CURRENT SVG (THESIS):\n${currentSvg}\n\n` },
      { text: `MODIFICATION INSTRUCTION (ANTITHESIS):\n${instruction}\n\n` },
      { text: `ACTION: Generate the SYNTHESIS (New SVG Code).` }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    const rawText = response.text || '';
    return cleanResponse(rawText);

  } catch (error: any) {
    console.error("Gemini Refine Error:", error);
    throw new Error(error.message || "Failed to refine SVG.");
  }
};

// Helper to clean markdown blocks from response
const cleanResponse = (text: string): string => {
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
    
  if (svgMatch && svgMatch[0]) {
    return svgMatch[0];
  } else {
    return text.replace(/```xml/g, '').replace(/```svg/g, '').replace(/```/g, '').trim();
  }
}
