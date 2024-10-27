import prisma from "../lib/db.js";

// * Get all group of user
async function getGroup(req, res) {
  const { user, authenticated } = req.session;

  if (!authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  try {
    const groups = await prisma.group.findMany({
      where: { members: { some: { email: user } } },
    });

    return res.status(200).type("json").send(groups);
  } catch (error) {
    return res.status(500).type("json").send(`No groups found`);
  }
}

// * Get a group with id
async function getGroupwithId(req, res) {
  const { user, authenticated } = req.session;

  if (!authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const { id } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(id) },
      include: { members: { select: { id: true, email: true } } },
    });

    if (!group.members.some((member) => member.email === user)) {
      return res.status(401).type("json").send("You are not in this group");
    }

    return res.status(200).type("json").send(group);
  } catch (error) {
    return res.status(500).type("json").send(`No group found`);
  }
}

// * create a new group
async function newGroup(req, res) {
  const { user, authenticated } = req.session;

  if (!authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const { name, user_ids } = req.body;
  const user_ids_parsed = user_ids
    .split(",")
    .map((id) => ({ id: parseInt(id) }));

  try {
    const group = await prisma.group.create({
      data: {
        name,
        members: { connect: user_ids_parsed },
      },
    });

    return res.status(200).type("json").send(group);
  } catch (error) {
    return res.status(500).type("json").send(`Error creating group`);
  }
}

// * Add friend to group
async function addFriendtoGroupwithId(req, res) {
  const { user, authenticated } = req.session;

  if (!authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const { id } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(id) },
      include: { members: { select: { id: true, email: true } } },
    });

    if (!group.members.some((member) => member.email === user)) {
      return res.status(401).type("json").send("You are not in this group");
    }
  } catch (error) {
    return res.status(500).type("json").send("Error getting group info");
  }

  const { user_ids } = req.body;

  const user_ids_parsed = user_ids
    .split(",")
    .map((id) => ({ id: parseInt(id) }));

  try {
    const group = await prisma.group.update({
      where: { id: parseInt(id) },
      data: { members: { connect: { id: parseInt(user_ids_parsed) } } },
    });

    return res.status(200).type("json").send(group);
  } catch (error) {
    return res.status(500).type("json").send("Error adding friend to group");
  }
}

// * Remove friend from group
async function removeFriendfromGroupwithId(req, res) {
  const { user, authenticated } = req.session;

  if (!authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const { id } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(id) },
      include: { members: { select: { id: true, email: true } } },
    });

    if (!group.members.some((member) => member.email === user)) {
      return res.status(401).type("json").send("You are not in this group");
    }
  } catch (error) {
    return res.status(500).type("json").send("Error getting group info");
  }

  const { user_ids } = req.body;

  const user_ids_parsed = user_ids
    .split(",")
    .map((id) => ({ id: parseInt(id) }));

  try {
    const group = await prisma.group.update({
      where: { id: parseInt(id) },
      data: { members: { disconnect: { id: parseInt(user_ids_parsed) } } },
    });

    return res.status(200).type("json").send(group);
  } catch (error) {
    return res
      .status(500)
      .type("json")
      .send("Error removing friend from group");
  }
}

// * Delete a group
async function deleteGroupwithId(req, res) {
  const { user, authenticated } = req.session;

  if (!authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const { id } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(id) },
      include: { members: { select: { id: true, email: true } } },
    });

    if (!group.members.some((member) => member.email === user)) {
      return res.status(401).type("json").send("You are not in this group");
    }
  } catch (error) {
    return res.status(500).type("json").send("Error getting group info");
  }

  try {
    const group = await prisma.group.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).type("json").send(group);
  } catch (error) {
    return res.status(500).type("json").send("Error deleting group");
  }
}

export {
  getGroup,
  getGroupwithId,
  newGroup,
  addFriendtoGroupwithId,
  removeFriendfromGroupwithId,
  deleteGroupwithId,
};
