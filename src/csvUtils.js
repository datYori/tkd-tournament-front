import Papa from 'papaparse';

export const expectedHeaders = ['Name', 'Age Category', 'Weight Category', 'Gender', 'Kup Category'];

export const trimAndNormalize = (data) => {
  return data.map(row => ({
    Name: row.Name ? row.Name.trim() : '',
    "Age Category": row["Age Category"] ? row["Age Category"].trim() : '',
    "Weight Category": row["Weight Category"] ? row["Weight Category"].trim() : '',
    Gender: row.Gender ? row.Gender.trim() : '',
    "Kup Category": row["Kup Category"] ? row["Kup Category"].trim() : '',
  }));
};

export const formatData = (data) => {
  return data.map(row => ({
    Name: row.Name,
    "Age Category": row["Age Category"].charAt(0).toUpperCase() + row["Age Category"].slice(1).toLowerCase(),
    "Weight Category": row["Weight Category"],
    Gender: row.Gender.toUpperCase(),
    "Kup Category": row["Kup Category"].toUpperCase(),
  }));
};

export const validateData = (data) => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  const weightCategoryRegex = /^[+-]\d{2}kg$/i;
  const ageCategoryRegex = /^(Benjamins|Minims|Cadette|Junior|Senior)$/i;
  const kupCategoryRegex = /^[A-B]$/i;
  const genderRegex = /^[MF]$/i;

  const errors = [];

  const valid = data.map((row, index) => {
    const rowErrors = [];
    if (!nameRegex.test(row.Name)) rowErrors.push("The name should contain only letters and spaces.");
    if (!weightCategoryRegex.test(row["Weight Category"])) rowErrors.push("The weight category should be in the form '+/-XXkg' (e.g., -20kg, +87kg).");
    if (!ageCategoryRegex.test(row["Age Category"])) rowErrors.push("The age category should be one of: Benjamins, Minims, Cadette, Junior, Senior.");
    if (!kupCategoryRegex.test(row["Kup Category"])) rowErrors.push("The kup category should be either 'A' or 'B'.");
    if (!genderRegex.test(row.Gender)) rowErrors.push("The gender should be 'M' for male or 'F' for female.");

    if (rowErrors.length > 0) {
      errors.push({ line: index + 2, errors: rowErrors }); // +2 for header and 1-based index
    }

    return rowErrors.length === 0;
  }).every(valid => valid);

  return { valid, errors };
};

export const parseCSV = (input, callback) => {
  Papa.parse(input, {
    header: true,
    complete: function (results) {
      const normalizedData = trimAndNormalize(results.data).filter(row => Object.values(row).some(val => val));
      const headersValid = Object.keys(normalizedData[0]).every(header => expectedHeaders.includes(header));
      if (!headersValid) {
        callback({ valid: false, errors: [{ line: 0, errors: ["CSV headers do not match the expected format."] }] });
        return;
      }
      const validation = validateData(normalizedData);
      const formattedData = formatData(normalizedData);
      callback({ valid: validation.valid, errors: validation.errors, data: formattedData });
    },
  });
};
