export const fetchJSON = async (endPt: string) => {
  const res = await fetch(endPt);
  if (res.ok) {
    return await res.json();
  }
  return undefined;
};
