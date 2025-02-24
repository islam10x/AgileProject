export function validateEmail(email) {
  if (!email) {
    return false; // Email is required
  } else if (email.includes("@")) {
    const [localPart, domainPart] = email.split("@");

    if (!localPart || !domainPart || !domainPart.includes(".")) {
      return false; // Invalid email format
    } else {
      return true; // Valid email
    }
  } else {
    return false; // Email must contain '@'
  }
}
