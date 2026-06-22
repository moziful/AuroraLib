"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";
import {
  MdCloudUpload,
  MdClose,
  MdBook,
  MdPerson,
  MdEmail,
  MdCategory,
  MdDescription,
  MdAttachMoney,
  MdCheckCircle,
  MdArrowBack,
  MdPublish,
} from "react-icons/md";
import { MdVerified } from "react-icons/md";
import { addBook, revalidateBooks } from "@/lib/actions";

async function fetchAuthToken() {
  const res = await fetch("/api/auth/token");
  if (!res.ok)
    throw new Error("Failed to retrieve auth token. Are you signed in?");
  const data = await res.json();
  if (!data.success || !data.token)
    throw new Error(data.message || "No token returned.");
  return data.token;
}

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Thriller",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Horror",
  "Biography",
  "History",
  "Self-Help",
  "Technology",
  "Science",
  "Poetry",
  "Children",
  "Other",
];

const STATUSES = ["Available", "Unavailable", "Coming Soon"];

function Field({ icon, label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        <span className="text-sky-400">{icon}</span>
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
const inputCls =
  "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/20 transition";
export default function AddBookForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    genre: "",
    writerName: "",
    writerEmail: "",
    status: "Available",
    isFeatured: false,
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        writerName: user.name || prev.writerName,
        writerEmail: user.email || prev.writerEmail,
      }));
    }
  }, [user]);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.");
      return;
    }
    setCoverFile(file);
    setUploadedCoverUrl("");
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setUploadedCoverUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadCoverToImgBB = async () => {
    if (!coverFile) return "";
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("image", coverFile);
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.message || "Upload failed");
      setUploadedCoverUrl(data.url);
      return data.url;
    } catch (err) {
      toast.error("Cover upload failed: " + err.message);
      return "";
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.genre || !form.writerName || !form.writerEmail) {
      toast.error("Title, Genre, Writer Name, and Writer Email are required.");
      return;
    }

    setSubmitting(true);
    try {
      let coverImage = uploadedCoverUrl;
      if (coverFile && !uploadedCoverUrl) {
        coverImage = await uploadCoverToImgBB();
        if (!coverImage) {
          setSubmitting(false);
          return;
        }
      }

      const token = await fetchAuthToken();

      await addBook(
        {
          ...form,
          coverImage,
          price: parseFloat(form.price) || 0,
        },
        token,
      );
      toast.success("Book published successfully!");
      await revalidateBooks();
      setTimeout(() => router.push("/dashboard/writer"), 1500);
    } catch (err) {
      toast.error("Failed to publish: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="!bg-slate-800 !text-slate-100 !border !border-slate-700"
      />
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-400 transition-all hover:border-sky-500/40 hover:text-sky-400"
            >
              <MdArrowBack className="text-lg" /> Back
            </button>
            <div>
              <h1 className="text-3xl font-black text-white">
                Add a New <span className="text-sky-400">Book</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the details below to publish a book to AuroraLib.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 h-full">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Cover Image
                  </p>
                  {coverPreview ? (
                    <div className="relative">
                      <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl border border-slate-700">
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                        {uploadedCoverUrl && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <MdCheckCircle className="text-5xl text-emerald-400" />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
                      >
                        <MdClose />
                      </button>
                      {!uploadedCoverUrl && !uploadingCover && (
                        <button
                          type="button"
                          onClick={uploadCoverToImgBB}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 py-2 text-xs font-bold text-sky-400 transition hover:bg-sky-500/20"
                        >
                          <MdCloudUpload className="text-base" /> Upload to
                          ImgBB
                        </button>
                      )}
                      {uploadingCover && (
                        <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                          <span className="text-xs text-slate-400">
                            Uploading…
                          </span>
                        </div>
                      )}
                      {uploadedCoverUrl && (
                        <p className="mt-3 flex items-center justify-center gap-1 text-xs text-emerald-400">
                          <MdCheckCircle /> Uploaded successfully
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex aspect-2/3 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/50 transition-all hover:border-sky-500/50 hover:bg-slate-800"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-700 transition group-hover:bg-sky-500/10">
                        <MdCloudUpload className="text-3xl text-slate-500 transition group-hover:text-sky-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-400 group-hover:text-sky-400">
                          Click to upload
                        </p>
                        <p className="text-xs text-slate-600">
                          PNG, JPG, WEBP · Max 5 MB
                        </p>
                      </div>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverSelect}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="lg:col-span-2 space-y-5">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Book Info
                  </p>
                  <Field icon={<MdBook />} label="Title" required>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. The Quantum Enigma"
                      className={inputCls}
                      required
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field icon={<MdCategory />} label="Genre" required>
                      <select
                        name="genre"
                        value={form.genre}
                        onChange={handleChange}
                        className={`${inputCls} cursor-pointer appearance-none`}
                        required
                      >
                        <option value="" disabled className="text-slate-600">
                          Select genre…
                        </option>
                        {GENRES.map((g) => (
                          <option key={g} value={g} className="bg-slate-800">
                            {g}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field
                      icon={<MdAttachMoney />}
                      label="Price (USD)"
                      required
                    >
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        required
                        onChange={handleChange}
                        placeholder="e.g. 32.99"
                        min="0"
                        step="0.01"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                  <Field icon={<MdDescription />} label="Description">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="A short synopsis of the book…"
                      rows={4}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                  <Field icon={<MdPublish />} label="Status">
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={`${inputCls} cursor-pointer appearance-none`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-slate-800">
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Writer Info
                  </p>
                  {user && (
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MdVerified className="text-sky-400" />
                      Prefilled from your account info. You can modify these.
                    </p>
                  )}
                  {sessionLoading && (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                      <span className="text-xs text-slate-500">
                        Loading session…
                      </span>
                    </div>
                  )}
                  {!sessionLoading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field icon={<MdPerson />} label="Writer Name" required>
                        <div className="relative">
                          <input
                            type="text"
                            name="writerName"
                            value={form.writerName}
                            onChange={handleChange}
                            placeholder="e.g. Nathan Clarke"
                            className={inputCls}
                            required
                          />
                        </div>
                      </Field>
                      <Field icon={<MdEmail />} label="Writer Email" required>
                        <div className="relative">
                          <input
                            type="email"
                            name="writerEmail"
                            value={form.writerEmail}
                            onChange={handleChange}
                            placeholder="e.g. nathan@auroralib.com"
                            className={inputCls}
                            required
                          />
                        </div>
                      </Field>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submitting || uploadingCover}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 py-3.5 text-sm font-black text-black shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <MdPublish className="text-lg" />
                      Publish Book
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
