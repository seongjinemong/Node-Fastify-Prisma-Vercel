import prisma from "../lib/db.js";

// * Get all friends of user
async function getFriend(req, res) {
  const { user, authenticated } = req.session;

  if (!authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const friends = await prisma.user.findUnique({
    where: { email: user },
    include: { friends: true },
  });

  console.log(friends);

  return res.status(200).type("json").send(friends.friends);
}

// * Add a friend
async function addFriend(req, res) {
  // user: email of the user, authenticated: boolean
  const { user, authenticated } = req.session;

  if (!authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const friend_email = req.body.email;

  try {
    // Check if the friend exists
    const friendExists = await prisma.user.findUnique({
      where: { email: friend_email },
    });

    if (!friendExists) {
      return res
        .status(404)
        .type("json")
        .send(`User with email ${friend_email} not found`);
    }

    // Add the friend to the user's friends list
    const updatedUser = await prisma.user.update({
      where: { email: user },
      data: {
        friends: {
          connect: { email: friend_email },
        },
      },
    });

    const friends = await prisma.user.findUnique({
      where: { email: user },
      include: { friends: true },
    });

    return res.status(200).type("json").send(friends.friends);
  } catch (error) {
    return res
      .status(500)
      .type("json")
      .send(`An error occurred while adding the friend: ${error.message}`);
  }
}

// * Delete a friend
async function removeFriend(req, res) {
  const { user, authenticated } = req.session;

  if (!authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const friend_email = req.body.email;

  try {
    const updatedUser = await prisma.user.update({
      where: { email: user },
      data: {
        friends: {
          disconnect: { email: friend_email },
        },
      },
    });

    const friends = await prisma.user.findUnique({
      where: { email: user },
      include: { friends: true },
    });

    return res.status(200).type("json").send(friends.friends);
  } catch (error) {
    return res
      .status(500)
      .type("json")
      .send(`An error occurred while removing the friend: ${error.message}`);
  }
}

export { getFriend, addFriend, removeFriend };
