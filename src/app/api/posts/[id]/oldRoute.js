import fs from "fs";
import path from "path";

const postsFile = path.join(process.cwd(), "src/data/posts.json");

export async function GET(req, { params }) {
  const { id } = params;
  const data = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  const post = data.find((p) => p.id === parseInt(id));

  if (!post) {
    return new Response(JSON.stringify({ error: "Post no encontrado" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ post }), { status: 200 });
}
