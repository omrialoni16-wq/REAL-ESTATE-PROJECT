import React from "react";

const PropertyCard = ({
  property,
  onDelete,
  onEdit,
  onViewLocation,
  onPublish,
  canManage = false,
}) => {
  return (
    <div className="property-card">
      {property.img && (
        <img src={property.img} alt="Property" className="property-image" />
      )}

      <div className="card-content">
        <h2>
          {property.street}, {property.city}
        </h2>

        <p className="price">₪{property.price.toLocaleString()}</p>

        <div className="details">
          <span>{property.rooms} rooms</span> |
          <span> floor {property.floor}</span> |
          <span> {property.size} sqm</span>
        </div>

        <span className="type">{property.type}</span>

        <div className="card-actions">
          <button
            className="location-btn"
            onClick={() => onViewLocation(property)}
          >
            📍 View Location
          </button>
          <button className="publish-btn" onClick={() => onPublish(property)}>
            𝕏 Publish
          </button>
        </div>

        {canManage && (
          <div className="card-actions">
            <button className="edit-btn" onClick={() => onEdit(property)}>
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => onDelete(property._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
