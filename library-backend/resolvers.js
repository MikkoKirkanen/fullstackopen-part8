import { GraphQLError } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'
import Book from './models/book.js'
import Author from './models/author.js'
import User from './models/user.js'

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        query.author = author?.id
      }
      if (args.genre) {
        query.genres = args.genre
      }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => Author.find({}),
    user: (root, args, context) => {
      return context.currentUser
    },
    allGenres: async () => Book.find().distinct('genres'),
  },
  Author: {
    name: (root) => root.name,
    bookCount: async ({id}, _args, { loaders }) => loaders.bookLoader.load(id)
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        name: args.name,
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      await user.save().catch((error) => {
        throw new GraphQLError('Creating user failed', {
          extensions: { code: 'BAD_USER_INPUT', error },
        })
      })
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'password') {
        throw new GraphQLError('Wrong username or password', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { token: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save().catch((error) => {
          throw new GraphQLError('Adding author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        })
      }
      args.author = author.id
      const book = new Book({ ...args })
      await book.save().catch((error) => {
        throw new GraphQLError('Adding book failed', {
          extensions: {
            error,
          },
        })
      })

      await book.populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('Author does not exist')
      }

      author.born = args.born
      await author.save().catch((error) => {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      })
      return author
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    },
  },
}

export default resolvers
