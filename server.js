import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/generate-bouquet", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Chưa cấu hình OPENAI_API_KEY trong file .env." });
    }
    const { flowers = [], palette = "soft pastel pink", style = "luxury romantic florist arrangement", wrapping = "premium cream wrapping paper", title = "" } = req.body || {};
    if (!Array.isArray(flowers) || flowers.length === 0) {
      return res.status(400).json({ error: "Hãy chọn ít nhất một loại hoa." });
    }
    const flowerList = flowers
      .filter(f => f && typeof f.name === "string")
      .map(f => `${f.name}: ${Math.max(1, Math.min(20, Number(f.quantity) || 1))} stems`)
      .join(", ");

    const prompt = `Create one exceptionally beautiful, photorealistic premium florist product photograph of a hand-tied luxury bouquet.
The customer's selected flowers are: ${flowerList}.
Color palette: ${palette}. Floristry style: ${style}. Wrapping: ${wrapping}.
Bouquet concept name (mood reference only): ${String(title).slice(0, 60)}.
Make the selected flower varieties clearly recognizable, with natural botanical forms, realistic petal textures and appropriate colors. Respect the selected mix and relative quantities as closely as possible. Compose a professionally balanced, abundant but elegant bouquet, with a refined silhouette, beautiful layered flowers, subtle greenery, carefully tied stems and sophisticated wrapping.
Pure seamless white studio background (#FFFFFF), premium high-key product photography, soft diffused studio light, subtle realistic grounding shadow, crisp details, natural color, centered full bouquet with all wrapping and stems visible, vertical portrait composition.
No people, no hands, no vase, no table, no lettering, no labels, no watermark, no collage, no illustration, no cartoon, no CGI. It must look like a real photograph taken for a luxury florist catalogue.`;

    const result = await openai.images.generate({
      model: "gpt-image-2.5-flare",
      prompt,
      size: "1024x1536",
      quality: "high",
      output_format: "png",
      background: "opaque",
      n: 1
    });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error("Image API returned no image data.");
    res.json({ image: `data:image/png;base64,${b64}` });
  } catch (error) {
    console.error("Image generation error:", error);
    if (error?.status === 401) return res.status(401).json({ error: "API Key không hợp lệ. Kiểm tra OPENAI_API_KEY." });
    if (error?.status === 429) return res.status(429).json({ error: "API đang chạm giới hạn hoặc hết quota. Kiểm tra billing/usage rồi thử lại." });
    res.status(500).json({ error: "Tạo ảnh chưa thành công. Kiểm tra cấu hình API và thử lại." });
  }
});

app.listen(port, "0.0.0.0", () => console.log(`Tiệm Hoa Nhỏ is running on port ${port}`));
