import {NextRequest, NextResponse} from "next/server";
import {OpenAI} from "openai";


export async function POST(request: NextRequest) {

    const client = new OpenAI(
        {apiKey: process.env.OPENAI_API_KEY},
    );

    const formData = await request.formData();
    const filePart = formData.get("file") as File;

    const file = await client.files.create({
        file: filePart,
        purpose: "user_data"
    })

    return NextResponse.json({id: file.id}, {status: 200});
}

export async function DELETE(request: NextRequest) {

    const client = new OpenAI(
        {apiKey: process.env.OPENAI_API_KEY},
    );


    const formData = await request.formData();
    const fileId = formData.get("fileId") as string;
    if (fileId) {
        await client.files.delete(fileId);
    }
    return NextResponse.json(null, {status: 203})
}