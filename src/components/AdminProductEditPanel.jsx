import { useEffect, useRef, useState } from 'react';
import { MAX_IMAGE_SIZE_MB, validateImageFiles, getMainImage, getAllImages, getFileNameFromUrl } from '../lib/images';

function AdminProductEditPanel({
  plushie,
  form,
  setForm,
  pendingFiles,
  setPendingFiles,
  deletedImages,
  setDeletedImages,
  onSave,
  onCancel,
  loading,
  isEditing,
  formError,
  formSuccess
}) {
  const fileInputRef = useRef(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [displayIndex, setDisplayIndex] = useState(0);

  const existingImages = form.images || [];
  const allImages = [...existingImages.filter((url) => !deletedImages.includes(url)), ...previewUrls];
  const mainImageIndex = form.mainImageIndex ?? 0;

  useEffect(() => {
    const urls = pendingFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pendingFiles]);

  useEffect(() => {
    setDisplayIndex(Math.max(0, Math.min(mainImageIndex, allImages.length - 1)));
  }, [allImages.length, mainImageIndex, existingImages.length, previewUrls.length]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const { validFiles, errors } = validateImageFiles(files);
    if (errors.length > 0) {
      alert(errors.join('. '));
    }
    if (validFiles.length > 0) {
      setPendingFiles((prev) => [...prev, ...validFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => {
    const existingCount = existingImages.filter((url) => !deletedImages.includes(url)).length;
    if (index < existingCount) {
      const visibleExisting = existingImages.filter((url) => !deletedImages.includes(url));
      const removedUrl = visibleExisting[index];
      setDeletedImages((prev) => [...prev, removedUrl]);
    } else {
      const pendingIndex = index - existingCount;
      setPendingFiles((prev) => prev.filter((_, i) => i !== pendingIndex));
    }
  };

  const handleSetMainImage = (index) => {
    setForm({ ...form, mainImageIndex: index });
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDisplayIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDisplayIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const title = isEditing ? '✏️ Editar Peluche' : '➕ Agregar Peluche';
  const displayImage = allImages[displayIndex] || getMainImage(plushie) || '';

  return (
    <>
      <button className="detail-close-btn" onClick={onCancel} type="button">✕</button>
      <form onSubmit={handleSubmit} className="detail-inner admin-edit-inner">
        <div className="detail-image-block admin-edit-image-block admin-gallery-block">
          {displayImage ? (
            <>
              <img src={displayImage} alt={plushie?.name || 'Vista previa'} className="detail-image admin-gallery-image" />
              {allImages.length > 1 && (
                <>
                  <button type="button" className="gallery-arrow gallery-arrow-left" onClick={handlePrevImage}>‹</button>
                  <button type="button" className="gallery-arrow gallery-arrow-right" onClick={handleNextImage}>›</button>
                  <div className="gallery-dots">
                    {allImages.map((_, idx) => (
                      <span key={idx} className={`gallery-dot${idx === displayIndex ? ' active' : ''}`} />
                    ))}
                  </div>
                </>
              )}
              <button
                type="button"
                className="admin-image-btn admin-image-remove"
                onClick={() => handleRemoveImage(displayIndex)}
                title="Eliminar esta imagen"
              >
                ✕
              </button>
              {displayIndex !== mainImageIndex && (
                <button
                  type="button"
                  className="admin-image-btn admin-image-star"
                  onClick={() => handleSetMainImage(displayIndex)}
                  title="Marcar como imagen principal"
                >
                  ☆
                </button>
              )}
              {displayIndex === mainImageIndex && (
                <span className="admin-image-btn admin-image-star active" title="Imagen principal">⭐</span>
              )}
            </>
          ) : (
            <div className="admin-no-image">Sin imagen</div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
        <div className="detail-info-block admin-edit-info-block">
          <div className="admin-edit-title">{title}</div>
          <div className="admin-form-group">
            <label>Nombre del Peluche</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
              placeholder="Ej: Pikachu 25cm"
            />
          </div>

          <div className="admin-form-group">
            <label>Descripción *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="admin-input"
              rows={4}
              placeholder="Ej: Peluche suave de Pikachu de 25cm, edición primera generación."
            />
          </div>

          <div className="admin-edit-row">
            <div className="admin-form-group">
              <label>Precio</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="admin-input"
                placeholder="15.00"
              />
            </div>
            <div className="admin-form-group">
              <label>Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="admin-input"
                placeholder="10"
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Imágenes {isEditing ? '(opcional añadir más)' : '*'} — Máx {MAX_IMAGE_SIZE_MB}MB cada una</label>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%' }}
            >
              📷 Subir imágenes
            </button>
            {allImages.length > 0 && (
              <div className="admin-thumbnails">
                {allImages.map((url, idx) => (
                  <div
                    key={`${url}-${idx}`}
                    className={`admin-thumb${idx === mainImageIndex ? ' admin-thumb-main' : ''}`}
                    onClick={() => setDisplayIndex(idx)}
                    title={idx === mainImageIndex ? 'Imagen principal' : 'Ver imagen'}
                  >
                    <img src={url} alt={`Miniatura ${idx + 1}`} />
                    {idx === mainImageIndex && <span className="admin-thumb-star">⭐</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {formError && <p className="admin-error">{formError}</p>}
          {formSuccess && <p className="admin-success">{formSuccess}</p>}

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ marginTop: 'auto', alignSelf: 'stretch', width: '100%' }}
          >
            {loading ? (
              <span className="btn-spinner-container">
                <span className="btn-spinner"></span>
                Guardando...
              </span>
            ) : (
              'GUARDAR CAMBIOS'
            )}
          </button>
        </div>
      </form>
    </>
  );
}

export default AdminProductEditPanel;
