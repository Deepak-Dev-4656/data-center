import axios from 'axios';

// Cloudinary configuration
const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/drqf2lmep/upload'; // Your Cloudinary Cloud Name
const cloudinaryPreset = 'imagestor'; // Your upload preset

// Function to upload an image/video/pdf/music to Cloudinary
export const uploadMediaToCloudinary = async (file) => {
  try {
    // Create a form data object
    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData
    formData.append('upload_preset', cloudinaryPreset); // Add upload preset

    // Send the file to Cloudinary API
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type for file uploads
      },
    });

    // Return the secure URL of the uploaded media
    return response.data.secure_url; // This is the URL of the uploaded media
  } catch (error) {
    console.error('Error uploading media to Cloudinary:', error);
    throw new Error('Media upload failed. Please try again.');
  }
};
