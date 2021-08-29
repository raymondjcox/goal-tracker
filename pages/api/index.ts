import { ApolloServer } from "apollo-server-micro"
import { DateTimeResolver } from "graphql-scalars"
import { NextApiHandler } from "next"
import {
  asNexusMethod,
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
} from "nexus"
import path from "path"
import cors from "micro-cors"
import prisma from "../../lib/prisma"

export const GQLDate = asNexusMethod(DateTimeResolver, "date")

const User = objectType({
  name: "User",
  definition(t) {
    t.int("id")
    t.string("name")
    t.string("email")
  },
})

const Goal = objectType({
  name: "Goal",
  definition(t) {
    t.int("id")
    t.string("name")
    t.string("type")
    t.date("createdAt")
  },
})

const Task = objectType({
  name: "Task",
  definition(t) {
    t.int("id")
    t.string("name")
    t.date("createdAt")
  },
})

const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("goal", {
      type: "Goal",
      args: {
        goalId: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.goal.findUnique({
          where: { id: Number(args.goalId) },
        })
      },
    })

    t.list.field("goals", {
      type: "Goal",
      resolve: (_parent, _args) => {
        return prisma.goal.findMany({ orderBy: [{ createdAt: "desc" }] })
      },
    })
  },
})

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("signupUser", {
      type: "User",
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
      },
      resolve: (_, { name, email }) => {
        return prisma.user.create({
          data: {
            name,
            email,
          },
        })
      },
    })

    t.field("createGoal", {
      type: "Goal",
      args: {
        name: nonNull(stringArg()),
        type: nonNull(stringArg()),
      },
      resolve: (_, { name, type }) => {
        return prisma.goal.create({
          data: {
            name,
            type,
          },
        })
      },
    })

    t.field("updateGoal", {
      type: "Goal",
      args: {
        name: nonNull(stringArg()),
        type: nonNull(stringArg()),
        id: nonNull(intArg()),
      },
      resolve: (_, { name, type, id }) => {
        return prisma.goal.update({
          where: {
            id,
          },
          data: {
            name,
            type,
          },
        })
      },
    })

    t.field("deleteGoal", {
      type: "Goal",
      args: {
        id: nonNull(intArg()),
      },
      resolve: (_, { id }) => {
        return prisma.goal.delete({
          where: {
            id,
          },
        })
      },
    })
  },
})

export const schema = makeSchema({
  types: [Query, Mutation, Goal, Task, User, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), "generated/nexus-typegen.ts"),
    schema: path.join(process.cwd(), "generated/schema.graphql"),
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({ schema })

let apolloServerHandler: NextApiHandler

async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    await apolloServer.start()

    apolloServerHandler = apolloServer.createHandler({
      path: "/api",
    })
  }

  return apolloServerHandler
}

const handler: NextApiHandler = async (req, res) => {
  const apolloServerHandler = await getApolloServerHandler()

  if (req.method === "OPTIONS") {
    res.end()
    return
  }

  return apolloServerHandler(req, res)
}

export default cors()(handler)
