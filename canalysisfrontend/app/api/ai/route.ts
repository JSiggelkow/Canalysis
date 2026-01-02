import {NextRequest} from "next/server";
import {OpenAI} from "openai";



export async function POST(request: NextRequest) {

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;
    const fileId = formData.get("fileId") as string;
    const model = formData.get("model") as string;
    const tempValue = formData.get("temperature");
    const temperature = tempValue ? Number(tempValue) : 0.5;

    const stream = await client.responses.create({
        model: model,
        temperature: temperature,
        input: [{
            role: "user",
            content: [
                {
                    type: 'input_file',
                    file_id: fileId,
                },
                {
                    type: "input_text",
                    text: prompt
                }
            ]
        }],
        stream: true
    })

    const readableStream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            for await (const event of stream) {
                if (event.type === 'response.output_text.delta') {
                    controller.enqueue(encoder.encode(event.delta));
                }
            }
            controller.close();
        }
    });

    return new Response(readableStream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}