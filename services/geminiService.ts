



import { GoogleGenAI } from "@google/genai";

interface AttachedFileData {
    name: string;
    data: string; // base64 string
    mimeType: string;
    extractedText?: string;
}

interface ChatHistoryMessage {
    sender: 'user' | 'ai';
    text: string;
    file?: AttachedFileData | null;
}

const getAIResponse = async (history: ChatHistoryMessage[]): Promise<string> => {
    // Note: The API key is sourced from `process.env.API_KEY`, which is assumed to be set in the deployment environment.
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `You are "REX AI", an expert assistant for REXCorp, a premier export-import logistics company in Indonesia. Your knowledge base is deeply specialized in Indonesian trade regulations, customs procedures, and international shipping documentation. You must adhere to the rules and information provided by the Indonesian National Single Window (INSW) at https://insw.go.id/.

Your primary functions are:
1.  **HS Code Classification:** Accurately identify Harmonized System (HS) codes for any product described or shown in an image.
2.  **Regulatory Guidance:** Provide clear, concise information on import/export requirements, taxes, duties, and restrictions for specific goods based on INSW regulations.
3.  **Document Drafting:** Generate drafts of essential shipping documents, including:
    - Bill of Lading (B/L)
    - Air Waybill (AWB)
    - Pemberitahuan Ekspor Barang (PEB - Customs Export Declaration)
    - Certificate of Origin (COO)
    - Packing Lists
    - Commercial Invoices
    - Shipping Instructions
4.  **Document Analysis:** Analyze uploaded documents (PDF, TXT) to summarize content, extract key information, or answer questions about them.
5.  **Process Explanation:** Explain complex logistics and customs clearance processes step-by-step.

When responding, be professional, accurate, and direct. Structure your answers for clarity, using lists or tables where appropriate. Always assume the context is professional logistics for REXCorp.`;

    const contents = history.map(msg => {
        const role = msg.sender === 'user' ? 'user' : 'model';
        const parts = [];
        let effectiveText = msg.text;

        if (msg.file) {
            if (msg.file.mimeType === 'application/pdf' && msg.file.extractedText) {
                // For PDFs, combine extracted text with the user prompt for that specific turn.
                effectiveText = `The user has attached a PDF document named "${msg.file.name}". Please analyze its content provided below and answer the user's question based on it.

--- DOCUMENT CONTENT START ---
${msg.file.extractedText}
--- DOCUMENT CONTENT END ---

User's question: "${msg.text || 'Summarize the document.'}"`;
            } else {
                // For other file types (like images), add the file as a separate part
                parts.push({
                    inlineData: {
                        mimeType: msg.file.mimeType,
                        data: msg.file.data,
                    },
                });
            }
        }
        
        // Always add the text part
        parts.push({ text: effectiveText });
        
        return { role, parts };
    });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents, // Pass the entire conversational history
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topP: 0.95,
                topK: 64,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            return `Error calling Gemini API: ${error.message}. Please ensure your API key is correctly configured.`;
        }
        return "An unknown error occurred while contacting the Gemini API.";
    }
};

const PROFIT_LOSS_DATA = [
    { name: 'Jan', value: 12 }, { name: 'Feb', value: 19 }, { name: 'Mar', value: 3 },
    { name: 'Apr', value: 5 }, { name: 'May', value: 2 }, { name: 'Jun', value: 3 },
];

const SHIPMENT_REVENUE_DATA = [
    { name: 'Jan', shipments: 40, revenue: 120000 }, { name: 'Feb', shipments: 30, revenue: 95000 },
    { name: 'Mar', shipments: 50, revenue: 150000 }, { name: 'Apr', shipments: 48, revenue: 140000 },
    { name: 'May', shipments: 60, revenue: 180000 }, { name: 'Jun', shipments: 55, revenue: 165000 },
];

const getBusinessInsights = async (): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const pnlDataString = JSON.stringify(PROFIT_LOSS_DATA.map(d => ({ month: d.name, profitInMillions: d.value })));
    const shipmentDataString = JSON.stringify(SHIPMENT_REVENUE_DATA.map(d => ({ month: d.name, shipments: d.shipments, revenue: d.revenue })));

    const prompt = `
        Analyze the following business data for a logistics company and provide 3-5 actionable insights.
        Format the response as a bulleted list, where each bullet point starts with '* '.

        Here is the data:
        - Profit and Loss (in millions USD): ${pnlDataString}
        - Shipment Volume vs. Revenue (USD): ${shipmentDataString}

        Based on this data, what are the key trends, potential issues, and strategic recommendations for REXCorp?
    `;

    const systemInstruction = `You are an expert financial analyst providing insights for a logistics company named REXCorp. Your analysis should be sharp, data-driven, and focused on providing actionable business advice. Structure your response clearly.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.6,
                topP: 0.95,
                topK: 64,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            return `Error calling Gemini API: ${error.message}. Please ensure your API key is correctly configured.`;
        }
        return "An unknown error occurred while contacting the Gemini API.";
    }
};


export { getAIResponse, getBusinessInsights };