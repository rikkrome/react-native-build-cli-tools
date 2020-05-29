/**
 * @data  feed object
 * @sortKey string 'alphabetical', 'most-recent', 'skill-level'
 * @sortOrder string 'asc', 'desc'
 * returns array
 */
exports.objectValues = ({ data, key, sortDirection = 'desc' }) => {
  try {
    let array = data;
    if (data && typeof data === 'object') {
      array = Object.values(data);
    }
    if (array && Array.isArray(array)) {
      const sortedArray = array.sort((a, b) => {
        const itemA = a[key];
        const itemB = b[key];
        if (itemA < itemB) return -1;
        return itemA > itemB ? 1 : 0;
      });
      if (sortDirection === 'desc') {
        sortedArray.reverse();
      }
      return sortedArray;
    }
  } catch (error) {
    debugger;
  }
  // error return
  if (data && typeof data === 'object') {
    return Object.values(data);
  }
  return data;
};

