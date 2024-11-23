export async function GET() {
    return new Response(JSON.stringify({ message: "This is a GET request" }), { status: 200 });
}

export async function POST(req) {
    const data = await req.json();
    return new Response(JSON.stringify({ message: "POST request received", data }), { status: 201 });
}

export async function PUT(req) {
    const data = await req.json();
    return new Response(JSON.stringify({ message: "PUT request received", data }), { status: 200 });
}

export async function DELETE() {
    return new Response(JSON.stringify({ message: "DELETE request received" }), { status: 200 });
}
