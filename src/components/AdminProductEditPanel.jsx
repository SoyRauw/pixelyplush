import { useEffect, useRef, useState } from 'react';

function AdminProductEditPanel({
  plushie,
  form,
  setForm,
  imageFile,
  setImageFile,
  onSave,
  onCancel,
  loading,
  isEditing,
  formError,
  formSuccess
}) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const displayImage = plushie?.image?.replace('/pixelyplush/assets/', '/assets/') || plushie?.image || '';

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [imageFile]);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const title = isEditing ? '✏️ Editar Peluche' : '➕ Agregar Peluche';

  return (
    <>
      <button className="detail-close-btn" onClick={onCancel} type="button">✕</button>
      <form onSubmit={handleSubmit} className="detail-inner admin-edit-inner">
        <div className="detail-image-block admin-edit-image-block">
          {previewUrl ? (
            <img src={previewUrl} alt="Vista previa" className="detail-image" />
          ) : displayImage ? (
            <img src={displayImage} alt={plushie?.name} className="detail-image" />
          ) : (
            <div className="admin-no-image">Sin imagen</div>
          )}
          <input
            type="file"
            accept="image/*"
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
            <label>Imagen {isEditing ? '(opcional)' : '*'}</label>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%' }}
            >
              {imageFile ? `📷 ${imageFile.name}` : isEditing ? '📷 Cambiar imagen' : '📷 Subir imagen'}
            </button>
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
