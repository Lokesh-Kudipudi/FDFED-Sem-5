import React, { useState } from "react";
import { FaTimes, FaCamera, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const ProfilePhotoModal = ({ isOpen, onClose, currentPhoto, userName, onPhotoUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a photo first");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await fetch(
        "http://localhost:5500/dashboard/upload-photo",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        toast.success("Profile photo updated successfully!");
        onPhotoUpdate(data.photoUrl);
        setSelectedFile(null);
        setPreview(null);
        onClose();
      } else {
        throw new Error(data.message || "Failed to upload photo");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003366] to-[#0055aa] px-6 py-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-white">Update Profile Photo</h2>
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto flex-1">
          {/* Current Photo */}
          <div className="text-center">
            <p className="text-xs md:text-sm text-gray-600 mb-3">Current Profile Photo</p>
            {currentPhoto ? (
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                <img
                  src={currentPhoto}
                  alt={userName || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-br from-[#003366] to-[#0055aa] flex items-center justify-center text-white text-2xl md:text-3xl font-bold border-4 border-gray-200 shadow-lg">
                {userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* File Upload */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-3">
              Choose New Photo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-input"
                disabled={isUploading}
              />
              <label
                htmlFor="photo-input"
                className="block border-2 border-dashed border-[#003366] rounded-xl p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <FaCamera className="text-2xl md:text-3xl text-[#003366] mx-auto mb-2" />
                <p className="text-xs md:text-sm font-semibold text-[#003366]">
                  Click to select a photo
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB
                </p>
              </label>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <p className="text-xs md:text-sm font-bold text-gray-700 mb-3">Preview</p>
              <div className="w-full h-40 md:h-48 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* File Name */}
          {selectedFile && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600">Selected file:</p>
              <p className="text-xs md:text-sm font-semibold text-[#003366] truncate">
                {selectedFile.name}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-4 md:px-6 py-4 flex gap-3 flex-shrink-0">
          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="flex-1 px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg font-bold text-xs md:text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 px-4 py-2 md:py-3 bg-gradient-to-r from-[#003366] to-[#0055aa] text-white rounded-lg font-bold text-xs md:text-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span className="hidden sm:inline">Uploading...</span>
              </>
            ) : (
              <>
                <FaCheck /> <span className="hidden sm:inline">Upload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoModal;
