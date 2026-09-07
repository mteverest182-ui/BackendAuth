import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";

const BANNER_CONFIG = {
  DESKTOP: {
    width: 1920,
    height: 600,
    quality: 82,
  },
  MOBILE: {
    width: 750,
    height: 500,
    quality: 82,
  },
};

const uploadToCloudinary = (buffer, bannerId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `ecommerce/banners/${bannerId}`,
        resource_type: "image",
        format: "webp",
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(buffer);
  });
};

export const uploadBannerImage = async ( file, bannerId, device, ) => { if (!file?.buffer) { throw new Error( `File ${device} tidak memiliki buffer yang valid`, ); } const metadata = await sharp( file.buffer, ).metadata(); if (!metadata.width || !metadata.height) { throw new Error( `Ukuran gambar ${device} tidak dapat dibaca.`, ); } const result = await new Promise( (resolve, reject) => { const stream = cloudinary.uploader.upload_stream( { folder: `ecommerce/banners/${bannerId}`, resource_type: "image", format: "webp", }, (error, result) => { if (error) { reject(error); } else { resolve(result); } }, ); stream.end(file.buffer); }, ); return { device, imageUrl: result.secure_url, publicId: result.public_id, width: metadata.width, height: metadata.height, fileSize: file.size, mimeType: file.mimetype, }; }; export const deleteBannerImage = async ( publicId, ) => { if (!publicId) return; await cloudinary.uploader.destroy( publicId, ); };
