import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
  const navigate = useNavigate()

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(false)
  const fileRef = useRef()

  /* ── Image preview ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || !file.type.startsWith('image/')) return
    // Programmatically set file on the hidden input isn't possible,
    // so we show preview and let the real input hold the value.
    // For DnD to work with FormData, we store the file in state.
    setDroppedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const [droppedFile, setDroppedFile] = useState(null)

  const clearImage = (e) => {
    e.stopPropagation()
    setPreview(null)
    setDroppedFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  /* ── Submit — same axios call as before ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)

    // If user dropped a file instead of picking, override the FormData entry
    if (droppedFile) {
      formData.set('image', droppedFile)
    }

    axios.post('https://mern-postboard.onrender.com/create-post', formData)
      .then(() => {
        showToast()
        setTimeout(() => navigate('/feed'), 1400)
      })
      .catch((err) => {
        console.log(err)
        alert('Error creating post')
        setLoading(false)
      })
  }

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2800)
  }

  const canSubmit = preview && !loading

  return (
    <section className="create-post-section">
      <div className="cp-inner">

        {/* Heading */}
        <div className="cp-heading">
          <h1>Share a moment<span>.</span></h1>
          <p>Upload a photo and add a caption to post to your feed.</p>
        </div>

        {/* Form */}
        <form className="cp-form" onSubmit={handleSubmit}>

          {/* Upload Zone */}
          <div
            className="upload-zone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              ref={fileRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />

            {preview ? (
              <>
                <img src={preview} alt="Preview" className="upload-preview" />
                <button
                  type="button"
                  className="upload-remove"
                  onClick={clearImage}
                  title="Remove image"
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="upload-idle">
                <div className="upload-icon-wrap">
                  {/* Camera icon */}
                  <svg viewBox="0 0 24 24">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <p>Drop image here or click to browse</p>
                <span>PNG, JPG, WEBP · up to 10 MB</span>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="cp-field">
            <label htmlFor="caption">Caption</label>
            <input
              type="text"
              id="caption"
              name="caption"
              placeholder="Write something about this moment…"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn-post${loading ? ' loading' : ''}`}
            disabled={!canSubmit}
          >
            {loading ? 'Posting…' : 'Post to Feed'}
          </button>

        </form>
      </div>

      {/* Toast */}
      <div className={`toast${toast ? ' show' : ''}`}>
        ✦ &nbsp; Post shared to your feed
      </div>
    </section>
  )
}

export default CreatePost
