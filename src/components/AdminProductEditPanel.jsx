import { useEffect, useMemo, useRef, useState } from 'react';
import { MAX_IMAGE_SIZE_MB, validateImageFiles, getMainImage } from '../lib/images';

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
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const existingImages = form.images || [];
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageItems = useMemo(() => {
    const items = [];
    existingImages.forEach((url, i) => {
      items.push({ type: 'existing', url, id: `existing-${url}-${i}` });
    });
    pendingFiles.forEach((file, i) => {
      items.push({ type: 'pending', url: previewUrls[i], file, id: `pending-${file.name}-${previewUrls[i]}` });
    });
    return items;
  }, [existingImages, pendingFiles, previewUrls]);

  const mainImageIndex = form.mainImageIndex ?? 0;
  const safeMainIndex = Math.max(0, Math.min(mainImageIndex, imageItems.length - 1));

  useEffect(() => {
    const urls = pendingFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pendingFiles]);

  useEffect(() => {
    setDisplayIndex(Math.max(0, Math.min(safeMainIndex, imageItems.length - 1)));
  }, [safeMainIndex, imageItems.length]);

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
    const item = imageItems[index];
    if (!item) return;

    if (item.type === 'existing') {
      const existingIndex = existingImages.findIndex((url) => url === item.url);
      setForm({
        ...form,
        images: existingImages.filter((_, i) => i !== existingIndex)
      });
      setDeletedImages((prev) => [...prev, item.url]);
    } else {
      const pendingIndex = pendingFiles.findIndex((file) => file === item.file);
      setPendingFiles((prev) => prev.filter((_, i) => i !== pendingIndex));
    }
  };

  const handleSetMainImage = (index) => {
    setForm({ ...form, mainImageIndex: index });
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const newItems = [...imageItems];
    const [moved] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, moved);

    const newExisting = newItems.filter((item) => item.type === 'existing').map((item) => item.url);
    const newPendingFiles = newItems.filter((item) => item.type === 'pending').map((item) => item.file);

    const oldMainItem = imageItems[safeMainIndex];
    const newMainIndex = newItems.findIndex((item) => item.id === oldMainItem?.id);

    setForm({
      ...form,
      images: newExisting,
      mainImageIndex: Math.max(0, newMainIndex)
    });
    setPendingFiles(newPendingFiles);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDisplayIndex((prev) => (prev + 1) % imageItems.length);
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDisplayIndex((prev) => (prev - 1 + imageItems.length) % imageItems.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const title = isEditing ? '✏️ Editar Peluche' : '➕ Agregar Peluche';
  const displayImage = imageItems[displayIndex]?.url || getMainImage(plushie) || '';

  useEffect(() => {
    setImageLoaded(false);
  }, [displayImage]);

  return (
    <>
      <button className="detail-close-btn" onClick={onCancel} type="button">✕</button>
      <form onSubmit={handleSubmit} className="detail-inner admin-edit-inner">
        <div className="detail-image-block admin-edit-image-block admin-gallery-block">
          {displayImage ? (
            <>
              <img
                src={displayImage}
                alt={plushie?.name || 'Vista previa'}
                className={`detail-image admin-gallery-image${imageLoaded ? ' loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="image-loader-overlay">
                  <span className="image-loader-spinner"></span>
                </div>
              )}
              {imageItems.length > 1 && (
                <>
                  <button type="button" className="gallery-arrow gallery-arrow-left" onClick={handlePrevImage}>‹</button>
                  <button type="button" className="gallery-arrow gallery-arrow-right" onClick={handleNextImage}>›</button>
                  <div className="gallery-dots">
                    {imageItems.map((_, idx) => (
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
              {displayIndex !== safeMainIndex && (
                <button
                  type="button"
                  className="admin-image-btn admin-image-star"
                  onClick={() => handleSetMainImage(displayIndex)}
                  title="Marcar como imagen principal"
                >
                  ☆
                </button>
              )}
              {displayIndex === safeMainIndex && (
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
            {imageItems.length > 0 && (
              <div className="admin-thumbnails">
                {imageItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`admin-thumb${idx === safeMainIndex ? ' admin-thumb-main' : ''}${idx === dragOverIndex ? ' drag-over' : ''}${idx === draggedIndex ? ' dragging' : ''}`}
                    onClick={() => setDisplayIndex(idx)}
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    draggable
                    title={idx === safeMainIndex ? 'Imagen principal (arrastra para reordenar)' : 'Arrastra para reordenar'}
                  >
                    <img src={item.url} alt={`Miniatura ${idx + 1}`} />
                    <button
                      type="button"
                      className="admin-thumb-remove"
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                      title="Eliminar imagen"
                    >
                      ✕
                    </button>
                    {idx === safeMainIndex && <span className="admin-thumb-star">⭐</span>}
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
