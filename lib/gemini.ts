import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

// Initialize the Google Generative AI SDK with a fallback for demo purposes
const genAI = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
  : null

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

// Function to generate a personalized response to a user's legal query
export async function generateLegalResponse(query: string): Promise<string> {
  try {
    // If Gemini API key is not available, return a fallback response
    if (!genAI) {
      return getFallbackLegalResponse(query)
    }

    // Create a generative model instance
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b",
      safetySettings,
    })

    // Prepare the prompt
    const prompt = `
      You are a helpful legal assistant. Provide a brief, informative response to the following legal query.
      Do not provide specific legal advice, but rather general information and suggest consulting with a qualified advocate.
      
      Query: "${query}"
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error("Error generating legal response:", error)
    return getFallbackLegalResponse(query)
  }
}

// Fallback responses when Gemini API is not available
function getFallbackLegalResponse(query: string): string {
  const queryLower = query.toLowerCase()

  if (queryLower.includes("property") || queryLower.includes("land") || queryLower.includes("real estate")) {
    return "Property disputes typically involve disagreements over ownership, boundaries, or usage rights. These cases often require documentation like property deeds, survey reports, and previous agreements. I recommend consulting with a Real Estate Law specialist who can review your specific situation and advise on the best course of action. Remember that property laws can vary significantly by location, so local expertise is valuable."
  } else if (queryLower.includes("divorce") || queryLower.includes("custody") || queryLower.includes("marriage")) {
    return "Family law matters like divorce and custody require careful consideration of many factors. These cases typically involve division of assets, determination of support payments, and creating parenting plans. Each family's situation is unique, and outcomes depend on many specific details. I recommend consulting with a Family Law advocate who can provide guidance tailored to your circumstances and help you understand your rights and responsibilities."
  } else if (queryLower.includes("crime") || queryLower.includes("arrest") || queryLower.includes("police")) {
    return "Criminal law matters are serious and require immediate attention from a qualified legal professional. If you're facing criminal charges or investigation, you have important rights that need protection. The specific procedures and potential consequences vary widely depending on the nature of the charges and your jurisdiction. I strongly recommend consulting with a Criminal Law advocate who can provide confidential advice specific to your situation and help ensure your rights are protected throughout the legal process."
  } else {
    return "Thank you for your question. Legal matters often involve complex considerations that depend on specific details of your situation. While I can provide general information, your case likely has unique aspects that require personalized attention. I recommend consulting with a qualified advocate who specializes in this area of law. They can review the specific details of your situation, explain your rights and options, and help you determine the best path forward based on your particular circumstances and applicable laws."
  }
}
