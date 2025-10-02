import { tool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import SentimentInputSchema from "../_schemas/sentimentInputSchema";

type SentimentOutput = "positive" | "negative";

const llm = new ChatGroq({
    model: "gemma2-9b-it",
    temperature: 0.7,
    maxTokens: 100,
    maxRetries: 2,
})

export const sentimentTool = tool(
    analyzer,
    {
        name: "sentiment_analyzer",
        description:
        "Analyzes if the given user review is a positive or a negative one. Returns 'positive' or 'negative'.",
        schema: SentimentInputSchema,
    }
)


async function analyzer({ review }: { review: string }): Promise<SentimentOutput> {
    console.log("sentiment analyzer called")
    const prompt = `
      You are a sentiment classifier. 
      Decide if the following review is positive or negative.
      Only answer with "positive" or "negative".
      Review: """${review}"""
    `

    // llm.invoke now returns an `AIMessage`
    const response = await llm.invoke([{ role: "user", content: prompt }])

    // Handle response correctly (array of content parts)
    let text: string
    if (Array.isArray(response.content)) {
        text = response.content.map((c) => ("text" in c ? c.text : "")).join(" ")
    } else {
        text = String(response.content)
    }

    const result = text.toLowerCase().trim()
    return result.includes("positive") ? "positive" : "negative"
}