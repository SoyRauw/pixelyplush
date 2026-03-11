function ProductCard({ image, alt, name, price, buttonText, isCyber, description, highlighted }) {
  return (
    <div
      className={`card${isCyber ? ' cyber-card' : ''}${highlighted ? ' cyber-highlighted' : ''}`}
      style={highlighted ? { borderColor: 'var(--accent-glow)' } : {}}
    >
      <img src={image} alt={alt} className="product-image" />
      <h3>{name}</h3>
      {description && (
        <p style={{ margin: '15px 0', color: '#aaa' }}>{description}</p>
      )}
      <div className="price">{price}</div>
      <button className="btn">{buttonText}</button>
    </div>
  );
}

export default ProductCard;
