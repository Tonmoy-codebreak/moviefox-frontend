"use client";

import React, { useState } from "react";
import { addNewMediaAction } from "@/actions/adminAction/addNewMedia.action";
import { useRouter } from "next/navigation";

type Genre = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  allGenres: Genre[];
};

const AddNewMedia = ({ allGenres }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    type: "MOVIE",
    access: "FREE",
    releaseYear: "",
    posterUrl: "",
    trailerUrl: "",
    streamingUrl: "",
    isPublished: false,
    isFeatured: false,
    genreIds: [] as string[],
  });

  const [genreSearch, setGenreSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddGenre = (genreId: string) => {
    if (!formData.genreIds.includes(genreId)) {
      setFormData((prev) => ({
        ...prev,
        genreIds: [...prev.genreIds, genreId],
      }));
    }
    setGenreSearch("");
    setIsDropdownOpen(false);
  };

  const handleRemoveGenre = (genreId: string) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.filter((id) => id !== genreId),
    }));
  };

  const filteredGenres = allGenres.filter(
    (genre) =>
      genre.name.toLowerCase().includes(genreSearch.toLowerCase()) &&
      !formData.genreIds.includes(genre.id),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {
      ...formData,
      releaseYear: formData.releaseYear
        ? Number(formData.releaseYear)
        : undefined,
      description:
        formData.description.trim() === "" ? undefined : formData.description,
      posterUrl:
        formData.posterUrl.trim() === "" ? undefined : formData.posterUrl,
      trailerUrl:
        formData.trailerUrl.trim() === "" ? undefined : formData.trailerUrl,
      streamingUrl:
        formData.streamingUrl.trim() === "" ? undefined : formData.streamingUrl,
    };

    const res = await addNewMediaAction(payload);

    setLoading(false);

    if (res.success) {
      setSuccessMsg("Media created successfully!");
      setTimeout(() => {
        router.push("/allmedia");
        router.refresh();
      }, 1000);
    } else {
      setErrorMsg(res.message || "Failed to create media");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
    >
      <h1>Add New Media</h1>

      {errorMsg && (
        <div style={{ color: "red", marginBottom: "10px" }}>{errorMsg}</div>
      )}
      {successMsg && (
        <div style={{ color: "green", marginBottom: "10px" }}>{successMsg}</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
            placeholder="Write media description..."
          />
        </div>

        {/* জেনার সার্চ ও ট্যাগ সিস্টেম */}
        <div style={{ position: "relative" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Genres
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "5px",
              minHeight: "40px",
              padding: "5px",
              border: "1px solid #ccc",
              marginBottom: "5px",
            }}
          >
            {formData.genreIds.length === 0 ? (
              <span style={{ color: "#888", fontSize: "14px" }}>
                No genres selected yet. Search below to add.
              </span>
            ) : (
              formData.genreIds.map((id) => {
                const genreObj = allGenres.find((g) => g.id === id);
                if (!genreObj) return null;
                return (
                  <span
                    key={genreObj.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "3px 8px",
                      background: "#eee",
                      borderRadius: "4px",
                    }}
                  >
                    {genreObj.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(genreObj.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ✕
                    </button>
                  </span>
                );
              })
            )}
          </div>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Type to search & add genres..."
              value={genreSearch}
              onChange={(e) => {
                setGenreSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              style={{ width: "100%", padding: "8px" }}
            />

            {isDropdownOpen && genreSearch.trim() !== "" && (
              <div
                style={{
                  position: "absolute",
                  zIndex: 10,
                  width: "100%",
                  background: "white",
                  border: "1px solid #ccc",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                {filteredGenres.length === 0 ? (
                  <div style={{ padding: "8px", color: "#888" }}>
                    No matching genres found.
                  </div>
                ) : (
                  filteredGenres.map((genre) => (
                    <div
                      key={genre.id}
                      onClick={() => handleAddGenre(genre.id)}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {genre.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="MOVIE">MOVIE</option>
            <option value="SERIES">SERIES</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Access
          </label>
          <select
            name="access"
            value={formData.access}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="FREE">FREE</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Release Year
          </label>
          <input
            type="number"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Poster URL
          </label>
          <input
            type="text"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Trailer URL
          </label>
          <input
            type="text"
            name="trailerUrl"
            value={formData.trailerUrl}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Streaming URL
          </label>
          <input
            type="text"
            name="streamingUrl"
            value={formData.streamingUrl}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            Is Published
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            Is Featured
          </label>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            style={{ padding: "8px 15px", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "8px 15px", cursor: "pointer" }}
          >
            {loading ? "Creating..." : "Create Media"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddNewMedia;
