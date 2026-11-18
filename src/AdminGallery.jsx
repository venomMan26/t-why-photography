
import { useEffect, useState } from "react";
import "./AdminGallery.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const categories = [
  "PORTRAITS",
  "WEDDINGS",
  "BABY & MATERNITY",
  "EVENTS",
  "COMMERCIAL",
  "VIDEO COVERAGE",
  "BIRTHDAY SHOOT",
];

const sizes = [
  { value: "normal", label: "Normal" },
  { value: "tall", label: "Tall" },
  { value: "wide", label: "Wide" },
  { value: "large", label: "Large" },
];

export default function AdminGallery() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("twhyAdminToken") || ""
  );

  const [username, setUsername] = useState(
    () => sessionStorage.getItem("twhyAdminUsername") || ""
  );

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const [photos, setPhotos] = useState([]);

  const [form, setForm] = useState({
    title: "",
    category: "PORTRAITS",
    size: "normal",
    image: null,
  });

  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  async function loadPhotos() {
    const response = await fetch(`${API_URL}/api/gallery`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load gallery.");
    }

    setPhotos(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    if (!token) return;

    async function verifySession() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: authHeaders,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Session expired.");
        }

        setUsername(data.username || "");

        sessionStorage.setItem(
          "twhyAdminUsername",
          data.username || ""
        );

        await loadPhotos();
      } catch (err) {
        sessionStorage.removeItem("twhyAdminToken");
        sessionStorage.removeItem("twhyAdminUsername");

        setToken("");
        setError(err.message);
      }
    }

    verifySession();
  }, [token]);

  async function handleLogin(event) {
    event.preventDefault();

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      sessionStorage.setItem("twhyAdminToken", data.token);

      sessionStorage.setItem(
        "twhyAdminUsername",
        data.username || login.username
      );

      setToken(data.token);
      setUsername(data.username || login.username);

      setMessage("Welcome to your gallery dashboard.");

      await loadPhotos();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("twhyAdminToken");
    sessionStorage.removeItem("twhyAdminUsername");

    setToken("");
    setUsername("");
    setPhotos([]);
    setEditing(null);
    setMessage("");
    setError("");
  }

  async function uploadPhoto(event) {
    event.preventDefault();

    if (!form.image) {
      setError("Please choose an image to upload.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const body = new FormData();

      body.append("title", form.title);
      body.append("category", form.category);
      body.append("size", form.size);
      body.append("image", form.image);

      const response = await fetch(`${API_URL}/api/gallery`, {
        method: "POST",
        headers: authHeaders,
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      setForm({
        title: "",
        category: "PORTRAITS",
        size: "normal",
        image: null,
      });

      event.target.reset();

      setMessage(
        data.message || "Photograph uploaded successfully."
      );

      await loadPhotos();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(event) {
    event.preventDefault();

    if (!editing) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/gallery/${editing._id}`,
        {
          method: "PATCH",
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editing.title,
            category: editing.category,
            size: editing.size,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update photograph."
        );
      }

      setEditing(null);

      setMessage(data.message || "Photograph updated.");

      await loadPhotos();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deletePhoto(photo) {
    if (!window.confirm(`Delete "${photo.title}" permanently?`)) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/gallery/${photo._id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete photograph."
        );
      }

      setMessage(data.message || "Photograph deleted.");

      await loadPhotos();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <main className="admin-page">
        <a href="/" className="admin-back">
          ← BACK TO WEBSITE
        </a>

        <form className="admin-login" onSubmit={handleLogin}>
          <span className="section-kicker">
            T-WHY PHOTOGRAPHY STUDIO
          </span>

          <h1>
            ADMIN <em>LOGIN.</em>
          </h1>

          <p>Sign in to manage your studio gallery.</p>

          <label>
            USERNAME
            <input
              autoComplete="username"
              value={login.username}
              onChange={(e) =>
                setLogin({ ...login, username: e.target.value })
              }
              required
            />
          </label>

          <label>
            PASSWORD
            <input
              type="password"
              autoComplete="current-password"
              value={login.password}
              onChange={(e) =>
                setLogin({ ...login, password: e.target.value })
              }
              required
            />
          </label>

          {error && (
            <p className="admin-error">{error}</p>
          )}

          <button className="admin-primary" disabled={busy}>
            {busy ? "PLEASE WAIT..." : "SIGN IN"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <a href="/" className="admin-brand">
          <span>T-Why</span>
          <small>PHOTOGRAPHY STUDIO</small>
        </a>

        <div>
          <span>
            Signed in{username ? ` as ${username}` : ""}
          </span>

          <button onClick={logout} className="admin-logout">
            LOG OUT
          </button>
        </div>
      </header>

      <section className="admin-content">
        <div className="admin-heading">
          <div>
            <span className="section-kicker">
              STUDIO MANAGEMENT
            </span>

            <h1>
              GALLERY <em>DASHBOARD.</em>
            </h1>

            <p>
              Upload, edit and manage photographs displayed on
              your website.
            </p>
          </div>

          <a href="/" className="admin-view-site">
            VIEW WEBSITE ↗
          </a>
        </div>

        <form className="admin-upload" onSubmit={uploadPhoto}>
          <h2>ADD A NEW PHOTOGRAPH</h2>

          <div className="admin-form-grid">
            <label>
              PHOTO TITLE
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="e.g. The Wedding Story"
                required
              />
            </label>

            <label>
              CATEGORY
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              DISPLAY SIZE
              <select
                value={form.size}
                onChange={(e) =>
                  setForm({ ...form, size: e.target.value })
                }
              >
                {sizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-file-label">
              CHOOSE IMAGE
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.files?.[0] || null,
                  })
                }
                required
              />
            </label>
          </div>

          <p className="admin-hint">
            Image files only · Maximum size 5MB.
          </p>

          <button className="admin-primary" disabled={busy}>
            {busy ? "WORKING..." : "UPLOAD PHOTOGRAPH"}
          </button>
        </form>

        {message && (
          <p className="admin-success">{message}</p>
        )}

        {error && (
          <p className="admin-error">{error}</p>
        )}

        <div className="admin-list-heading">
          <h2>
            YOUR PHOTOGRAPHS <span>({photos.length})</span>
          </h2>

          <button
            onClick={() =>
              loadPhotos().catch((err) => setError(err.message))
            }
          >
            REFRESH ↻
          </button>
        </div>

        {photos.length === 0 ? (
          <p className="admin-empty">
            No photographs uploaded yet. Add your first
            photograph above.
          </p>
        ) : (
          <div className="admin-photo-grid">
            {photos.map((photo) => (
              <article
                className="admin-photo-card"
                key={photo._id}
              >
                <img src={photo.imageUrl} alt={photo.title} />

                {editing?._id === photo._id ? (
                  <form
                    className="admin-edit-form"
                    onSubmit={saveEdit}
                  >
                    <input
                      value={editing.title}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          title: e.target.value,
                        })
                      }
                      required
                    />

                    <select
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          category: e.target.value,
                        })
                      }
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <select
                      value={editing.size || "normal"}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          size: e.target.value,
                        })
                      }
                    >
                      {sizes.map((size) => (
                        <option
                          key={size.value}
                          value={size.value}
                        >
                          {size.label}
                        </option>
                      ))}
                    </select>

                    <div>
                      <button
                        className="admin-primary"
                        disabled={busy}
                      >
                        SAVE
                      </button>

                      <button
                        type="button"
                        className="admin-cancel"
                        onClick={() => setEditing(null)}
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="admin-photo-info">
                    <small>{photo.category}</small>

                    <h3>{photo.title}</h3>

                    <p>{photo.size || "normal"} display</p>

                    <div>
                      <button
                        onClick={() => setEditing({ ...photo })}
                        className="admin-edit"
                      >
                        EDIT DETAILS
                      </button>

                      <button
                        onClick={() => deletePhoto(photo)}
                        className="admin-delete"
                        disabled={busy}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
