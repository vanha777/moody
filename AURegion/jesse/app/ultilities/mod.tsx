import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { Db } from "@/app/utils/db";
// Function to extract email and business name from text
async function extractUserInfo(text: string): Promise<{ email?: string, businessName?: string, hasUserInfo: boolean }> {
    try {
        const model = new ChatOpenAI({
            temperature: 0,
            modelName: 'gpt-4',
            openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        });

        const extractionPrompt = new PromptTemplate({
            template: `Extract the email address and business name from the text if present. 
      If either is not present, leave the field empty.
      Return the result as a valid JSON object with the keys "email" and "businessName".
      
      Text: {text}
      
      JSON:`,
            inputVariables: ["text"],
        });

        const extractionChain = new LLMChain({
            llm: model,
            prompt: extractionPrompt,
        });

        const result = await extractionChain.call({ text });
        const parsedResult = JSON.parse(result.text);

        return {
            email: parsedResult.email || undefined,
            businessName: parsedResult.businessName || undefined,
            hasUserInfo: !!(parsedResult.email || parsedResult.businessName)
        };
    } catch (error) {
        console.error('Error extracting user info:', error);
        return { hasUserInfo: false };
    }
}

// Function to save user info to database
async function saveUserInfoToDatabase(email?: string, businessName?: string): Promise<boolean> {
    try {
        const { data, error } = await Db.from('mood_clients').insert({
            email: email,
            name: businessName,
        });
        console.log("data", data);
        // TODO: Implement actual database saving logic here
        // This could be a call to your database API or service
        console.log('Saving to database:', { email, businessName });

        // For now, we'll just simulate a successful save
        return true;
    } catch (error) {
        console.error('Error saving to database:', error);
        return false;
    }
}

export default async function processCommand(transcript: string): Promise<string> {
    console.log("processing command");
    if (!transcript.trim()) return "";

    try {
        // First, check if the transcript contains user info to save
        const userInfo = await extractUserInfo(transcript);

        // If user info is found, save it to the database
        if (userInfo.hasUserInfo) {
            const saved = await saveUserInfoToDatabase(userInfo.email, userInfo.businessName);
            console.log('Database save result:', saved);
        }

        // Initialize OpenAI model through LangChain
        const model = new ChatOpenAI({
            temperature: 0,
            modelName: 'gpt-4', // Use 'gpt-4' or 'gpt-3.5-turbo' if 'gpt-4o-mini' is not a valid model name
            openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        });

        // Create a prompt template with a placeholder for the transcript
        const promptTemplate = new PromptTemplate({
            template: `You are an expert social media marketing consultant. 
            When providing advice, format your response for a chat interface with clear line breaks, bullet points, and emphasis where needed.
            
            Input: {text}
            
            Example output:
            **Here are some suggestions:**
            - 🟢 *Automate repetitive tasks to save time.*
            - 📈 *Use AI for data-driven decision-making.*
            - 💡 *Improve customer engagement through personalized interactions.*

            Provide your response in a similar format.`,
            inputVariables: ["text"],
        });

        // Create a chain with the model and prompt template
        const chain = new LLMChain({
            llm: model,
            prompt: promptTemplate,
        });

        // Execute the chain with the transcript as input
        const response = await chain.call({
            text: transcript,
        });

        console.log("response", response);

        // Return the response text directly (no need for JSON parsing if response is a plain string)
        return response.text ?? "";
    } catch (error) {
        console.error('Error processing command:', error);
        return "";
    } finally {
        console.log("command processed");
    }
}
