const User = require("../models/User")
const Group = require("../models/Group");

//api endpoint to handle all CRUD operations
const handleGroupCommand = async (req, res) => {
    const { command, data } = req.body

    console.log('Group command received:', command, 'Data:', data);

    try {
        //determine which operation to perform based on command
        switch (command) {
            case 'create':
                //get the creator name for easy searching
                const creator = await User.findById(data.createdBy);
                const creatorName = creator ? creator.name : 'Unknown';

                //create new group document
                const newGroup = new Group({
                    name: data.name,
                    description: data.description,
                    members: data.members,
                    createdBy: data.createdBy,
                    createdByName: creatorName,
                    admins: [data.createdBy],
                    privacy: data.privacy,
                    posts: data.posts
                })

                //save group to db
                await newGroup.save()

                return res.json({ message: 'group inserted successfully', group: newGroup })

            case 'list':
                //fetch all groups from db
                let query = {}
                //if userId is given, fetch all groups the user is a member 
                if (data.userId) {
                    query = { members: data.userId }
                }
                //otherwise fetch all groups
                const groups = await Group.find(query)

                //for each group fetch the creator name in paralel and wait for all async results
                const groupsWithNames = await Promise.all(groups.map(async (group) => {

                    const creator = await User.findById(group.createdBy);
                    const creatorName = creator ? creator.name : 'Unknown user';

                    return {
                        //copy the original group and add the creator name
                        ...group.toObject(),
                        createdByName: creatorName
                    };
                }));

                return res.json({ message: 'all groups fetched successfully', groups: groupsWithNames })

            case 'search':
                const { name, description, createdBy } = data
                const groupSearchQuery = {}

                //build search query based on provided parameters
                if (name) {
                    groupSearchQuery.name = { $regex: name, $options: 'i' }
                }
                if (description) {
                    groupSearchQuery.description = { $regex: description, $options: 'i' }
                }
                if (createdBy) {
                    groupSearchQuery.createdByName = { $regex: createdBy, $options: 'i' }
                }

                const groupSearchResults = await Group.find(groupSearchQuery)

                return res.json({
                    message: 'group search completed successfully',
                    groups: groupSearchResults,
                    searchCriteria: groupSearchQuery
                })

            case 'update':
                //find group by id and update their details
                const updateGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    {
                        $set: {
                            name: data.newName,
                            description: data.newDescription,
                            privacy: data.newPrivacy
                        }
                    },
                    { new: true }
                )
                if (!updateGroup) {
                    return res.json({ message: 'group not found' })
                }
                else {
                    return res.json({ message: 'group found & updated successfully', group: updateGroup })
                }

            case 'delete':
                //find group by id and delete them
                const deleteGroup = await (Group.findByIdAndDelete(data.groupId))
                if (!deleteGroup) {
                    return res.json({ message: 'group not found' })
                }
                else {
                    return res.json({ message: 'group found & deleted successfully', group: deleteGroup })
                }

            //membership actions

            case 'joinGroup':
                //add user to group members
                const joinGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    //add user to group members array 
                    { $addToSet: { members: data.userId } },
                    { new: true }
                )
                if (!joinGroup) {
                    return res.json({ message: 'group not found' })
                }

                //add group to user's groups array
                await User.findByIdAndUpdate(
                    data.userId,
                    { $addToSet: { groups: data.groupId } },
                    { new: true }
                )

                return res.json({ message: 'user joined group successfully', group: joinGroup })

            case 'leaveGroup':
                //remove user from group members
                const leaveGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { $pull: { members: data.userId } },
                    { new: true }
                )
                if (!leaveGroup) {
                    return res.json({ message: 'group not found' })
                }

                //also remove group from user's groups array
                await User.findByIdAndUpdate(
                    data.userId,
                    { $pull: { groups: data.groupId } },
                    { new: true }
                )

                return res.json({ message: 'user left group successfully', group: leaveGroup })

            //admin operations
            case 'addAdmin':
                //grant admin permissions to group member and ensure they're also a member
                const addAdminGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    {
                        $addToSet: {
                            admins: data.userId,
                            members: data.userId
                        }
                    },
                    { new: true }
                )
                if (!addAdminGroup) {
                    return res.json({ message: 'group not found' })
                }
                return res.json({ message: 'admin added successfully', group: addAdminGroup })

            case 'removeAdmin':
                //revoke admin permissions from group member
                const removeAdminGroup = await Group.findByIdAndUpdate(
                    data.groupId,
                    { $pull: { admins: data.userId } },
                    { new: true }
                )
                if (!removeAdminGroup) {
                    return res.json({ message: 'group not found' })
                }
                return res.json({ message: 'admin removed successfully', group: removeAdminGroup })

            case 'getGroup':
                //get a specific group with member names
                const singleGroup = await Group.findById(data.groupId)

                if (!singleGroup) {
                    return res.json({ message: 'group not found' })
                }

                // Check if group is private and user is not a member
                if (singleGroup.privacy === 'private' && !singleGroup.members.includes(data.userId)) {
                    return res.json({ message: 'Permission denied: Private group access required' })
                }

                // Get creator name
                const groupCreator = await User.findById(singleGroup.createdBy);
                const groupCreatorName = groupCreator ? groupCreator.name : 'Unknown';

                // Get member names
                const memberNames = await Promise.all(
                    singleGroup.members.map(async (memberId) => {
                        const member = await User.findById(memberId);
                        return {
                            id: memberId,
                            name: member ? member.name : 'Unknown'
                        };
                    })
                );

                return res.json({
                    message: 'group fetched successfully',
                    group: {
                        ...singleGroup.toObject(),
                        createdByName: groupCreatorName,
                        membersWithNames: memberNames
                    }
                })

            case 'getGroupPosts':
                //get all posts in a specific group with privacy check
                const Post = require("../models/Post")
                const group = await Group.findById(data.groupId)

                if (!group) {
                    return res.json({ message: 'group not found' })
                }

                //check if group is private and user is not a member
                if (group.privacy === 'private' && !group.members.includes(data.userId)) {
                    return res.json({ message: 'Permission denied: Private group access required' })
                }

                const groupPosts = await Post.find({ groupId: data.groupId })
                    .sort({ createdAt: -1 })
                return res.json({
                    message: 'group posts retrieved successfully',
                    posts: groupPosts
                })

            case 'checkAdmin':
                //check if user is admin of the group
                const checkGroup = await Group.findById(data.groupId);
                if (!checkGroup) {
                    return res.json({ message: 'group not found', isAdmin: false })
                }

                const isAdmin = checkGroup.admins && checkGroup.admins.includes(data.userId);
                return res.json({
                    message: 'admin check completed',
                    isAdmin: isAdmin
                })

            //if command is not recognized
            default:
                return res.json({ message: 'invalid command' })
        }
    }
    catch (error) {
        return res.json({ message: 'Error handling group command:', error: error.message })
    }
}

module.exports = { handleGroupCommand }