const calculateTimeLeft = (endDate) => {
    if (!endDate) return "No subscription"; // Handle missing subscription

    const today = new Date();
    const expiryDate = new Date(endDate);

    if (expiryDate < today) return "Expired"; // If already expired

    let years = expiryDate.getFullYear() - today.getFullYear();
    let months = expiryDate.getMonth() - today.getMonth();
    let days = expiryDate.getDate() - today.getDate();

    // Adjust negative values
    if (days < 0) {
        months -= 1;
        days += new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // Return only the most relevant unit
    if (years > 0) return `${years} years left`;
    if (months > 0) return `${months} months left`;
    return `${days} days left`;
};

// Export function
module.exports = { calculateTimeLeft };
