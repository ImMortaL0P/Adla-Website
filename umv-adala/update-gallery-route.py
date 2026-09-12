import re

with open('backend/routes/gallery.js', 'r') as f:
    content = f.read()

# Replace single upload with array upload
old_str = """router.post('/', auth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Image is too large. Maximum size is 8 MB.' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { caption_en, caption_hi, category, taken_on, event_name_en, event_name_hi, event_date, event_description_en, event_description_hi } = req.body;

    if (!caption_en) {
      return res.status(400).json({ message: 'English caption is required.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }
    if (!getGalleryFolderId()) {
      cleanupTempFile(req.file.path);
      return res.status(503).json({ message: 'DRIVE_GALLERY_FOLDER_ID or DRIVE_FOLDER_ID is not set.' });
    }
    if (!usesOAuth()) {
      cleanupTempFile(req.file.path);
      return res.status(503).json({
        message: 'Gallery uploads need OAuth. Run: node scripts/get-oauth-token.js',
      });
    }

    const uploaded = await uploadImageToDrive(req.file.path, req.file.originalname, req.file.mimetype);
    cleanupTempFile(req.file.path);

    const maxOrder = await GalleryImage.findOne().sort({ display_order: -1 }).select('display_order');
    const display_order = (maxOrder?.display_order ?? 0) + 1;

    const image = await GalleryImage.create({
      caption_en,
      caption_hi,
      category: category || 'campus',
      event_name_en: event_name_en || undefined,
      event_name_hi: event_name_hi || undefined,
      event_date: event_date || undefined,
      event_description_en: event_description_en || undefined,
      event_description_hi: event_description_hi || undefined,
      image_url: uploaded.image_url,
      thumbnail_url: uploaded.thumbnail_url,
      driveFileId: uploaded.driveFileId,
      taken_on: taken_on || undefined,
      display_order,
      is_published: true,
    });

    res.json(image);
  } catch (err) {
    console.error(err);
    cleanupTempFile(req.file?.path);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});"""

new_str = """router.post('/', auth, (req, res, next) => {
  upload.array('images', 20)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'One or more images are too large. Maximum size is 8 MB per file.' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { caption_en, caption_hi, category, taken_on, event_name_en, event_name_hi, event_date, event_description_en, event_description_hi } = req.body;

    if (!caption_en) {
      if (req.files) req.files.forEach(f => cleanupTempFile(f.path));
      return res.status(400).json({ message: 'English caption is required.' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Image files are required.' });
    }
    if (!getGalleryFolderId()) {
      req.files.forEach(f => cleanupTempFile(f.path));
      return res.status(503).json({ message: 'DRIVE_GALLERY_FOLDER_ID or DRIVE_FOLDER_ID is not set.' });
    }
    if (!usesOAuth()) {
      req.files.forEach(f => cleanupTempFile(f.path));
      return res.status(503).json({
        message: 'Gallery uploads need OAuth. Run: node scripts/get-oauth-token.js',
      });
    }

    const maxOrder = await GalleryImage.findOne().sort({ display_order: -1 }).select('display_order');
    let display_order = (maxOrder?.display_order ?? 0);

    const uploads = [];
    for (const file of req.files) {
      try {
        const uploaded = await uploadImageToDrive(file.path, file.originalname, file.mimetype);
        cleanupTempFile(file.path);

        display_order += 1;

        const image = await GalleryImage.create({
          caption_en,
          caption_hi,
          category: category || 'campus',
          event_name_en: event_name_en || undefined,
          event_name_hi: event_name_hi || undefined,
          event_date: event_date || undefined,
          event_description_en: event_description_en || undefined,
          event_description_hi: event_description_hi || undefined,
          image_url: uploaded.image_url,
          thumbnail_url: uploaded.thumbnail_url,
          driveFileId: uploaded.driveFileId,
          taken_on: taken_on || undefined,
          display_order,
          is_published: true,
        });

        uploads.push(image);
      } catch (err) {
        console.error("Failed to upload a file:", err);
        cleanupTempFile(file.path);
      }
    }

    if (uploads.length === 0) {
       return res.status(500).json({ message: 'Failed to upload images' });
    }

    res.json({ message: 'Images uploaded successfully', images: uploads });
  } catch (err) {
    console.error(err);
    if (req.files) req.files.forEach(f => cleanupTempFile(f.path));
    res.status(500).json({ message: err.message || 'Server Error' });
  }
});"""

content = content.replace(old_str, new_str)
with open('backend/routes/gallery.js', 'w') as f:
    f.write(content)
