export async function GET() {
    const message = { message: "Test API DELETE is working!" };
    return new Response(JSON.stringify(message), { status: 200 });
}