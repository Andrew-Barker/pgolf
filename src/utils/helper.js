export const titleCase = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  export const deleteData = async (apiEndpoint, id) => {
    const response = await fetch(`http://localhost:3001/${apiEndpoint}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete data from ${apiEndpoint}`);
    }
  };
  