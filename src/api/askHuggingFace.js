export async function askModel(prompt) {
    const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct", {
      method: "POST",
      headers: {
        Authorization: `Bearer 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`, // Replace this with your actual key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });
  
    const data = await response.json();
    return data.generated_text || data[0]?.generated_text || "No response";
  }
  