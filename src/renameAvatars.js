import { readdir, rename } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Path to the avatars folder
const avatarsFolder = join(__dirname, "assets/avatars");

async function renameAvatars() {
  try {
    // Read all files in the folder
    const files = await readdir(avatarsFolder);

    // Filter only image files (e.g., .png, .jpg, .jpeg, .svg)
    const imageFiles = files.filter((file) =>
      /\.(png|jpe?g|svg)$/i.test(file)
    );

    // Rename files sequentially
    await Promise.all(
      imageFiles.map((file, index) => {
        const oldPath = join(avatarsFolder, file);
        const newPath = join(avatarsFolder, `avatar${index + 1}.png`);
        return rename(oldPath, newPath);
      })
    );

    console.log("Files renamed successfully!");
  } catch (err) {
    console.error("Error renaming files:", err);
  }
}

renameAvatars();