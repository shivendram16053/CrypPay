// Capitalizes the first letter of a string
export const capitalize = (string) => {
  if (typeof string !== "string" || string.length === 0) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Truncates a string to a certain length and adds '...' at the end if it exceeds the limit
export const truncate = (longString, limit) => {
  if (typeof longString !== "string" || longString.length === 0) {
    return "";
  }

  if (longString.length > limit) {
    return longString.substring(0, limit) + "...";
  }

  return longString;
};

// Truncates the middle of a string, showing a specified number of characters from the start and end
export const truncateMiddle = (text, frontChars = 6, endChars = 4) => {
  if (typeof text !== "string" || text.length === 0) {
    return "";
  }

  if (text.length <= frontChars + endChars) {
    return text;
  }

  return `${text.slice(0, frontChars)}......${text.slice(-endChars)}`;
};
