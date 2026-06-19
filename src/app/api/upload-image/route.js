import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    if (!image || typeof image === "string") {
      return NextResponse.json(
        { success: false, message: "No image file provided." },
        { status: 400 }
      );
    }
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "ImgBB API key is not configured." },
        { status: 500 }
      );
    }
    const arrayBuffer = await image.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const imgbbForm = new FormData();
    imgbbForm.append("key", apiKey);
    imgbbForm.append("image", base64);
    const imgbbRes = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbForm,
    });
    const imgbbData = await imgbbRes.json();
    if (!imgbbRes.ok || !imgbbData.success) {
      return NextResponse.json(
        {
          success: false,
          message: imgbbData?.error?.message || "ImgBB upload failed.",
        },
        { status: 502 }
      );
    }
    return NextResponse.json({
      success: true,
      url: imgbbData.data.url,
    });
  } catch (err) {
    console.error("[upload-image] Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}