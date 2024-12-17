import DataLoader from 'dataloader'
import Book from './models/book.js'

const bookLoader = new DataLoader(async (ids) => {
  const books = await Book.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
  ]);

  const countMap = {};
  books.forEach((b) => {
    countMap[b._id] = b.count;
  });
  
  return ids.map((id) => countMap[id] || 0);
})

export default { bookLoader }
