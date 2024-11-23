import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
    const { file } = await req.json();
    try {
        const uploadResult = await cloudinary.v2.uploader.upload(file, {
            folder: 'tailtracker',
        });
        return new Response(JSON.stringify({ imageUrl: uploadResult.secure_url }), { status: 200 });
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Image upload failed' }), { status: 500 });
    }
}
