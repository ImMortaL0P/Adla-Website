sed -i '' -e '/import { staticGallery, staticGalleryStock } from '\''@\/data\/gallery'\''/d' ../src/components/home/GalleryPreview.tsx
sed -i '' -e '/import { staticGallery, staticGalleryStock } from '\''@\/data\/gallery'\''/d' ../src/pages/Gallery.tsx
sed -i '' -e '/import { stockPhotos } from '\''@\/data\/stockPhotos'\''/d' ../src/components/home/GalleryPreview.tsx
sed -i '' -e '/import { stockPhotos } from '\''@\/data\/stockPhotos'\''/d' ../src/pages/Gallery.tsx
sed -i '' -e '/import { StockPhoto } from '\''@\/components\/common\/StockPhoto'\''/d' ../src/components/home/GalleryPreview.tsx
sed -i '' -e '/import { StockPhoto } from '\''@\/components\/common\/StockPhoto'\''/d' ../src/pages/Gallery.tsx
