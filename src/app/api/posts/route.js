// import fs from "fs";
// import path from "path";

// const postsFile = path.join(process.cwd(), "src/data/posts.json");

// export async function GET() {
//   try {
//     const data = fs.readFileSync(postsFile, "utf-8");
//     const posts = JSON.parse(data);
//     return new Response(JSON.stringify({ success: true, posts }), { status: 200 });
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ success: false, error: "Error al obtener posts" }),
//       { status: 500 }
//     );
//   }
// }
