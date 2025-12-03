import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import toast from 'react-hot-toast';
import { UploadCloudIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';

/**
 * A reusable component for uploading and managing images with Supabase storage
 * 
 * @param {Object} props
 * @param {string} props.initialImageUrl - Initial image URL to display
 * @param {Function} props.onImageChange - Callback when image URL changes (uploads or removals)
 * @param {string} props.bucketName - Supabase storage bucket name
 * @param {string} props.folderName - Folder path within the bucket (default: 'public')
 * @param {string} props.label - Label text for the image field (default: 'Image')
 * @param {number} props.maxSizeMB - Maximum file size in MB (default: 5)
 * @param {string} props.imageShape - Shape of image preview ('square' or 'circle') (default: 'square')
 * @param {number} props.previewSize - Size of the preview in pixels (default: 128)
 * @param {boolean} props.required - Whether the field is required (default: false)
 */
export default function ImageUploader({ 
  initialImageUrl = null, 
  onImageChange, 
  bucketName,
  folderName = 'public',
  label = 'Image', 
  maxSizeMB = 5,
  imageShape = 'square',
  previewSize = 128,
  required = false
}) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageName, setCurrentImageName] = useState(null);

  useEffect(() => {
    setImageUrl(initialImageUrl);
    
    // Extract file name from URL if present
    if (initialImageUrl) {
      try {
        // Handle URLs with query parameters or path segments
        let urlPath = initialImageUrl;
        
        // Check if it's a Supabase storage URL 
        if (urlPath.includes('storage/v1/object/public/') || urlPath.includes('storage/v1/object/sign/')) {
          const urlObj = new URL(urlPath);
          const pathParts = urlObj.pathname.split('/');
          // Get the last part which should be the filename
          const fileName = pathParts[pathParts.length - 1];
          setCurrentImageName(decodeURIComponent(fileName));
          console.log(`Extracted image filename from URL for ${label}:`, fileName);
        } else {
          // Handle other URLs or local paths
          const urlParts = urlPath.split('/');
          setCurrentImageName(decodeURIComponent(urlParts[urlParts.length - 1]));
          console.log(`Extracted image filename from path for ${label}:`, urlParts[urlParts.length - 1]);
        }
      } catch (e) {
        console.error(`Error parsing image name from URL for ${label}:`, e);
        setCurrentImageName(null);
      }
    } else {
      setCurrentImageName(null);
    }
  }, [initialImageUrl, label]);

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file)); // Show preview
      console.log(`File selected for ${label}:`, file.name, 'Size:', file.size);
      
      // Auto-upload the file when selected
      await handleUpload(file);
    }
  };

  const handleUpload = async (file = null) => {
    const fileToUpload = file || imageFile;
    
    if (!fileToUpload) {
      toast.error('Please select an image file first.');
      return;
    }
    
    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (fileToUpload.size > maxSize) {
      toast.error(`Image is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    setUploading(true);
    console.log(`Starting upload process for ${label} file:`, fileToUpload.name);
    console.log(`Target bucket: ${bucketName}, folder: ${folderName}`);

    try {
      // Skip bucket existence check since we're getting empty arrays despite buckets existing
      // Create a unique filename
      const fileExt = fileToUpload.name.split('.').pop();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${Date.now()}_${randomId}.${fileExt}`;
      const filePath = `${folderName}/${fileName}`;
      
      console.log(`Uploading to ${bucketName}/${filePath}`);
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileToUpload, { 
          cacheControl: '3600', 
          upsert: true 
        });
        
      if (error) {
        console.error('Upload error details:', error);
        toast.error(`Upload failed: ${error.message || JSON.stringify(error)}`);
        return null;
      }
      
      console.log('Upload successful, response data:', data);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      console.log('Got public URL data:', publicUrlData);
      
      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Could not get public URL for the uploaded image');
      }
      
      const publicUrl = publicUrlData.publicUrl;
      console.log('Final public URL:', publicUrl);
      
      // Update the component state
      setImageUrl(publicUrl);
      setCurrentImageName(fileName);
      
      // Update the parent component
      if (onImageChange) {
        onImageChange(publicUrl, fileName);
      }
      
      toast.success('Image uploaded successfully!');
      return publicUrl; // Return URL for chaining
    } catch (error) {
      console.error('Error in upload process:', error);
      toast.error(`Upload failed: ${error.message || JSON.stringify(error)}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imageUrl && !currentImageName) {
      toast.error('No image to remove.');
      return;
    }
    setUploading(true);
    try {
      console.log(`Attempting to remove ${label} image:`, currentImageName);
      console.log('From bucket:', bucketName, 'folder:', folderName);
      
      if (currentImageName) {
        const filePath = `${folderName}/${currentImageName}`;
        console.log('Removing file at path:', filePath);
        
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);
          
        if (deleteError) {
          console.error('Error deleting file from storage:', deleteError);
          throw deleteError;
        }
        console.log('File successfully removed from storage');
      }
      
      setImageUrl(null);
      setImageFile(null);
      setCurrentImageName(null);
      
      // Update the parent component
      if (onImageChange) {
        onImageChange(null, null);
      }
      
      toast.success('Image removed successfully!');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error(`Removal failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const inputId = `image-upload-${bucketName}-${folderName}`.replace(/\//g, '-');
  const previewClassName = imageShape === 'circle' ? 'rounded-full' : 'rounded-md';

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 flex items-center space-x-4">
        <div 
          className={`w-${previewSize/4} h-${previewSize/4} border border-gray-300 ${previewClassName} overflow-hidden flex items-center justify-center bg-gray-50 relative`}
          style={{ width: previewSize, height: previewSize }}
        >
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={`${label} preview`}
              fill={true} 
              style={{ objectFit: "cover", position: "absolute" }} 
              sizes={`${previewSize}px`}
            />
          ) : (
            <UploadCloudIcon className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          id={inputId} 
          className="hidden" 
          required={required && !imageUrl}
        />
        <div className="flex flex-col gap-2">
          <label 
            htmlFor={inputId} 
            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            {imageUrl ? 'Change Image' : 'Upload Image'}
          </label>
          
          {imageUrl && (
            <button 
              type="button" 
              onClick={handleRemoveImage} 
              disabled={uploading} 
              className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {uploading ? 'Processing...' : (
                <>
                  <Trash2Icon className="w-4 h-4 mr-1" />
                  Remove
                </>
              )}
            </button>
          )}
          
          {currentImageName && (
            <p className="mt-1 text-xs text-gray-500 break-all">
              {currentImageName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 