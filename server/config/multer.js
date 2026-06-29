import multer from 'multer';
const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage
});
//# sourceMappingURL=multer.js.map