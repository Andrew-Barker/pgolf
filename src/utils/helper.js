export const titleCase = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const deleteData = async (apiEndpoint, id) => {
  const response = await fetch(`http://localhost:3001/${apiEndpoint}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete data from ${apiEndpoint}`);
  }
};

export const getClaims = (auth) => {
  const user = auth?.currentUser;
  if (user) {
    return user.getIdTokenResult()
      .then((idTokenResult) => {
        if (idTokenResult.claims.role === "admin") {
          // User has an "admin" role
          return true
        } else {
          // User does not have an "admin" role
          return false
        }
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  return Promise.resolve(false);
};

