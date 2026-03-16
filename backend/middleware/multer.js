import multer from "multer";
import path from "path";

// функция для безопасного имени файла (английский + timestamp)
const generateSafeName = (originalName) => {
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext)
        .replace(/[^a-z0-9]/gi, "_") // заменяем все кроме a-z0-9 на _
        .toLowerCase();
    return `${base}_${Date.now()}${ext}`;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, generateSafeName(file.originalname));
    },
});

const upload = multer({ storage });

export default upload;