import React, { useState, useEffect } from 'react'
import axios from 'axios'

/* ── Single Post Card ──────────────────────────── */
const PostCard = ({ post, index, onDelete }) => {
  const [loaded, setLoaded]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirm, setConfirm]   = useState(false)

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000)
      return
    }
    setDeleting(true)
    axios.delete(`http://localhost:3000/posts/${post._id}`)
      .then(() => onDelete(post._id))
      .catch((err) => {
        console.log(err)
        alert("Error deleting post")
        setDeleting(false)
        setConfirm(false)
      })
  }

  return (
    <article
      className="post-card"
      style={{ animationDelay: `${Math.min(index, 5) * 70}ms` }}
    >
      {/* Image */}
      <div className="post-img-wrap">
        {!loaded && <div className="skeleton" />}
        <img
          src={post.image}
          alt={post.caption}
          className={loaded ? 'img-loaded' : 'img-fade'}
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Caption + Delete */}
      <div className="post-body">
        <p className="post-caption">{post.caption}</p>
        <button
          className={`btn-delete${confirm ? ' btn-delete-confirm' : ''}`}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : confirm ? 'Tap again to confirm' : 'Delete'}
        </button>
      </div>
    </article>
  )
}

/* ── Skeleton Placeholder ──────────────────────── */
const SkeletonCard = ({ delay }) => (
  <div className="skel-card" style={{ animationDelay: `${delay}ms` }}>
    <div className="skel-img" />
    <div className="skel-body">
      <div className="skel-line" style={{ width: '75%' }} />
      <div className="skel-line" style={{ width: '50%', animationDelay: '0.15s' }} />
    </div>
  </div>
)

/* ── Feed Page ─────────────────────────────────── */
const Feed = () => {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:3000/posts')
      .then((res) => setPosts(res.data.posts))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId))
  }

  return (
    <section className="feed-section">

      <div className="feed-header">
        <h1>Your Feed<span>.</span></h1>
        <p className="feed-meta">
          {loading
            ? 'Loading posts…'
            : posts.length === 0
              ? 'No posts yet — be the first to share.'
              : `${posts.length} post${posts.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {loading && (
        <div className="feed-list">
          <SkeletonCard delay={0}   />
          <SkeletonCard delay={70}  />
          <SkeletonCard delay={140} />
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="feed-empty">
          <div className="feed-empty-icon">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <h3>Nothing here yet</h3>
          <p>Create your first post to get started.</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="feed-list">
          {posts.map((post, i) => (
            <PostCard
              key={post._id}
              post={post}
              index={i}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </section>
  )
}

export default Feed
