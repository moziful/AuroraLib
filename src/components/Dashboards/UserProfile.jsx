import { useState, useEffect } from "react";
import Image from "next/image";
import { MdEmail, MdPerson, MdVerifiedUser, MdEdit, MdSave, MdClose, MdCameraAlt } from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { updateUserDetails } from "@/lib/actions";

export default function UserProfile({ user, role = "Reader" }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync inputs if user prop changes
  useEffect(() => {
    if (user) {
      setNameInput(user.name || "");
      setImagePreview(user.image || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xl relative animate-pulse">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div className="flex items-center gap-4 w-full">
            <div className="h-16 w-16 rounded-2xl bg-slate-200 dark:bg-slate-850" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-slate-200 dark:bg-slate-850 rounded w-1/3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-1/4" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-950 p-4 space-y-2">
            <div className="h-3 bg-slate-205 dark:bg-slate-850 rounded w-1/4" />
            <div className="h-4 bg-slate-205 dark:bg-slate-850 rounded w-1/2" />
          </div>
          <div className="rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-950 p-4 space-y-2">
            <div className="h-3 bg-slate-205 dark:bg-slate-850 rounded w-1/4" />
            <div className="h-4 bg-slate-205 dark:bg-slate-850 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Define fallback colors based on the dashboard role
  const roleColors = {
    User: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    Reader: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    Writer: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    Admin: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  const currentBadgeColor = roleColors[role] || roleColors.Reader;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    setImagePreview(URL.createObjectURL(file));

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }
      setImagePreview(data.url);
      toast.success("Profile picture uploaded successfully!");
    } catch (err) {
      toast.error("Profile picture upload failed: " + err.message);
      // Reset back to original image
      setImagePreview(user?.image || "");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setNameInput(user?.name || "");
    setImagePreview(user?.image || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!nameInput.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      // 1. Update the database via backend API
      if (user?.id) {
        await updateUserDetails(user.id, {
          name: nameInput,
          image: imagePreview,
        });
      }

      // 2. Update the better-auth session locally
      const { error } = await authClient.updateUser({
        name: nameInput,
        image: imagePreview,
      });

      if (error) {
        throw new Error(error.message || "Failed to update auth session");
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error("Failed to save profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xl relative">
      {/* Edit Trigger Pen Icon */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-6 right-6 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400 transition"
          title="Edit Profile"
        >
          <MdEdit className="text-xl" />
        </button>
      )}

      <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="flex items-center gap-4 w-full">
          {/* Avatar Container */}
          <div className="relative group h-16 w-16 overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shadow-inner">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt={`${user?.name || "User"}'s avatar`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-500">
                <MdPerson className="text-3xl" />
              </div>
            )}
            
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              </div>
            )}

            {isEditing && !uploading && (
              <label
                htmlFor="avatar-edit-upload"
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-white"
              >
                <MdCameraAlt className="text-lg" />
                <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">Edit</span>
              </label>
            )}
          </div>
          
          {isEditing && (
            <input
              id="avatar-edit-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading || saving}
              className="hidden"
            />
          )}

          <div className="flex-1">
            {isEditing ? (
              <div className="max-w-xs">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  disabled={saving}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-200 outline-none focus:border-sky-400"
                />
              </div>
            ) : (
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user?.name || "Anonymous User"}
              </h3>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${currentBadgeColor}`}
              >
                <MdVerifiedUser className="text-sm" />
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="group rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-950 p-4 transition-colors hover:border-slate-300 dark:hover:border-slate-800">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-500 mb-1">
            <MdPerson className="text-sm" /> Full Name
          </span>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">
            {isEditing ? nameInput || "Entering name..." : user?.name || "Not provided"}
          </div>
        </div>

        <div className="group rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-950 p-4 transition-colors hover:border-slate-300 dark:hover:border-slate-800">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-500 mb-1">
            <MdEmail className="text-sm" /> Email Address
          </span>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">
            {user?.email || "Not provided"}
          </div>
        </div>
      </div>

      {/* Save and Cancel Buttons */}
      {isEditing && (
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving || uploading}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
          >
            <MdClose className="text-sm" /> Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex items-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-500 transition disabled:opacity-50"
          >
            <MdSave className="text-sm" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
