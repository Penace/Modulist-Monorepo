export function validateField(field, value) {
  let error = "";
  let warning = "";
  let extreme = false;

  switch (field) {
    case "title":
    case "location":
    case "address":
    case "propertyType":
    case "slug":
      error =
        value && typeof value === "string" && value.trim().length >= 3
          ? ""
          : `${field} must be at least 3 characters.`;
      break;

    case "parkingAvailable":
      error =
        value && typeof value === "string" && value.trim().length > 0
          ? ""
          : "Please select a parking option.";
      break;

    case "price": {
      const numeric = Number(value && value.toString().replace(/[^0-9.]/g, ""));
      if (!value || isNaN(numeric) || numeric < 100) {
        error = "Price must be at least $100.";
      } else if (numeric > 100000000) {
        warning = "This is an extremely high price. Please confirm.";
      } else if (numeric > 10000000) {
        warning = "This is a very high price. Admin will review.";
        extreme = true;
      }
      break;
    }

    case "description":
      error =
        value && typeof value === "string" && value.trim().length >= 10
          ? ""
          : "Description must be at least 10 characters.";
      break;

    case "images":
      error =
        Array.isArray(value) &&
        value.length >= 3 &&
        value.every(
          (file) =>
            typeof file.name === "string" &&
            (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg"))
        )
          ? ""
          : "Please upload at least 3 JPG/JPEG images.";
      break;

    case "bedrooms":
    case "bathrooms": {
      const numVal = Number(value);
      if (!value || isNaN(numVal) || numVal < 0) {
        error = `Please enter a valid number of ${field}.`;
      } else if (numVal > 100) {
        error = `Maximum allowed for ${field} is 100.`;
      } else if (numVal > 50) {
        warning = `Unusually high number of ${field}. Please confirm.`;
        extreme = true;
      }
      break;
    }

    case "squareFootage": {
      const numVal = Number(value);
      if (!value || isNaN(numVal) || numVal < 0) {
        error = "Please enter a valid square footage.";
      } else if (numVal > 50000) {
        warning = "That's a massive property. Double-check the square footage.";
      } else if (numVal > 20000) {
        warning = "Unusually large square footage. Admin will review.";
        extreme = true;
      }
      break;
    }

    case "yearBuilt": {
      const numVal = Number(value);
      const currentYear = new Date().getFullYear();
      if (!value || isNaN(numVal) || numVal < 0) {
        error = "Please enter a valid year.";
      } else if (numVal < 1600) {
        warning = "Is this a heritage item? Very old year.";
      } else if (numVal < 1700) {
        warning = "Very old year. Admin will review.";
        extreme = true;
      } else if (numVal > currentYear + 5) {
        error = `Year cannot be more than ${currentYear + 5}.`;
      } else if (numVal > currentYear) {
        warning = "Future year? Please confirm it's correct.";
      }
      break;
    }

    case "itemType":
      error =
        value && typeof value === "string" && value.trim().length > 0
          ? ""
          : "Please select a item type.";
      break;

    case "availableFrom":
      error = !isNaN(Date.parse(value)) ? "" : "Please enter a valid date.";
      break;

    case "features":
    case "amenities":
    case "facilities":
      error =
        Array.isArray(value) &&
        value.length > 0 &&
        value.some((item) => item && item.trim().length > 0)
          ? ""
          : `Please enter at least one ${field}.`;
      break;

    default:
      break;
  }

  return { error, warning, extreme };
}
