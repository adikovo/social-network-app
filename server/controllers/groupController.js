const User = require("../models/User")
const Group = require("../models/Group");
const Post = require("../models/Post");

// Create a new group
const createGroup = async (data) => {
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

    return { message: 'group inserted successfully', group: newGroup }
}

// List all groups or groups for a specific user
const listGroups = async (data) => {
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

    return { message: 'all groups fetched successfully', groups: groupsWithNames }
}

// Search groups by name, description, or creator
const searchGroups = async (data) => {
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

    return {
        message: 'group search completed successfully',
        groups: groupSearchResults,
        searchCriteria: groupSearchQuery
    }
}

// Update a group
const updateGroup = async (data) => {
    //find group first to check if user is authorized to update it
    const groupToUpdate = await Group.findById(data.groupId)
    if (!groupToUpdate) {
        return { message: 'group not found' }
    }

    //check if the user is the creator or an admin of the group
    if (groupToUpdate.createdBy !== data.userId && !groupToUpdate.admins.includes(data.userId)) {
        return { message: 'unauthorized: only group creators and admins can update groups', status: 403 }
    }

    //update the group if user is authorized
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
    return { message: 'group found & updated successfully', group: updateGroup }
}

// Delete a group
const deleteGroup = async (data) => {
    //find group first to check if user is authorized to delete it
    const groupToDelete = await Group.findById(data.groupId)
    if (!groupToDelete) {
        return { message: 'group not found' }
    }

    //check if the user is the creator of the group
    if (groupToDelete.createdBy !== data.userId) {
        return { message: 'unauthorized: only group creators can delete groups', status: 403 }
    }

    //delete the group if user is authorized
    const deleteGroup = await Group.findByIdAndDelete(data.groupId)
    return { message: 'group found & deleted successfully', group: deleteGroup }
}

// Join a group
const joinGroup = async (data) => {
    //get the group to check privacy
    const groupToJoin = await Group.findById(data.groupId)
    if (!groupToJoin) {
        return { message: 'group not found' }
    }

    //check if group is private
    if (groupToJoin.privacy === 'private') {
        //for private groups, add to join requests instead of members
        const updatedGroup = await Group.findByIdAndUpdate(
            data.groupId,
            { $addToSet: { joinRequests: data.userId } },
            { new: true }
        )
        return { message: 'join request sent successfully', group: updatedGroup }
    } else {
        //for public groups, add user to group members directly
        const joinGroup = await Group.findByIdAndUpdate(
            data.groupId,
            {
                $addToSet: { members: data.userId },
                $push: { memberJoinDates: { userId: data.userId, joinDate: new Date() } }
            },
            { new: true }
        )

        //add group to user's groups array
        await User.findByIdAndUpdate(
            data.userId,
            { $addToSet: { groups: data.groupId } },
            { new: true }
        )

        return { message: 'user joined group successfully', group: joinGroup }
    }
}

// Leave a group
const leaveGroup = async (data) => {
    //remove user from group members
    const leaveGroup = await Group.findByIdAndUpdate(
        data.groupId,
        { $pull: { members: data.userId } },
        { new: true }
    )
    if (!leaveGroup) {
        return { message: 'group not found' }
    }

    //also remove group from user's groups array
    await User.findByIdAndUpdate(
        data.userId,
        { $pull: { groups: data.groupId } },
        { new: true }
    )

    return { message: 'user left group successfully', group: leaveGroup }
}

// Add admin to a group
const addAdmin = async (data) => {
    //find group first to check if requesting user is authorized
    const groupToAddAdmin = await Group.findById(data.groupId)
    if (!groupToAddAdmin) {
        return { message: 'group not found' }
    }

    //check if the requesting user is the creator or an admin
    if (groupToAddAdmin.createdBy !== data.requestingUserId && !groupToAddAdmin.admins.includes(data.requestingUserId)) {
        return { message: 'unauthorized: only group creators and admins can add admins', status: 403 }
    }

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

    //add notification to the user who was promoted to admin
    const promotingUser = await User.findById(data.requestingUserId);
    const promotedUser = await User.findById(data.userId);

    await User.findByIdAndUpdate(
        data.userId,
        {
            $push: {
                notifications: {
                    type: 'adminPromoted',
                    fromUserId: data.requestingUserId,
                    fromUserName: promotingUser.name,
                    fromUserProfilePicture: promotingUser.profilePicture,
                    groupId: data.groupId,
                    groupName: addAdminGroup.name,
                    message: `You have been promoted to admin in "${addAdminGroup.name}"!`
                }
            }
        }
    );

    return { message: 'admin added successfully', group: addAdminGroup }
}

// Remove admin from a group
const removeAdmin = async (data) => {
    //find group first to check if requesting user is authorized
    const groupToRemoveAdmin = await Group.findById(data.groupId)
    if (!groupToRemoveAdmin) {
        return { message: 'group not found' }
    }

    //check if the requesting user is the creator 
    if (groupToRemoveAdmin.createdBy !== data.requestingUserId) {
        return { message: 'unauthorized: only group creators can remove admins', status: 403 }
    }

    //revoke admin permissions from group member
    const removeAdminGroup = await Group.findByIdAndUpdate(
        data.groupId,
        { $pull: { admins: data.userId } },
        { new: true }
    )
    return { message: 'admin removed successfully', group: removeAdminGroup }
}

// Get a specific group
const getGroup = async (data) => {
    //get a specific group with member names
    const singleGroup = await Group.findById(data.groupId)

    if (!singleGroup) {
        return { message: 'group not found' }
    }

    // Check if group is private and user is not a member
    const isPrivateAndNotMember = singleGroup.privacy === 'private' && !singleGroup.members.includes(data.userId);

    // Get creator name
    const groupCreator = await User.findById(singleGroup.createdBy);
    const groupCreatorName = groupCreator ? groupCreator.name : 'Unknown';

    if (isPrivateAndNotMember) {
        // For private groups where user is not a member, return basic info only
        return {
            message: 'group fetched successfully',
            group: {
                _id: singleGroup._id,
                name: singleGroup.name,
                description: singleGroup.description,
                privacy: singleGroup.privacy,
                createdBy: singleGroup.createdBy,
                createdByName: groupCreatorName,
                members: singleGroup.members,
                membersCount: singleGroup.members.length,
                admins: singleGroup.admins,
                isPrivateAndNotMember: true
            }
        };
    } else {
        // For public groups or private groups where user is a member, return full info
        const memberNames = await Promise.all(
            singleGroup.members.map(async (memberId) => {
                const member = await User.findById(memberId);
                return {
                    id: memberId,
                    name: member ? member.name : 'Unknown',
                    email: member ? member.email : '',
                    profilePicture: member ? member.profilePicture : null
                };
            })
        );

        return {
            message: 'group fetched successfully',
            group: {
                ...singleGroup.toObject(),
                createdByName: groupCreatorName,
                membersWithNames: memberNames,
                isPrivateAndNotMember: false
            }
        };
    }
}

// Get posts for a specific group
const getGroupPosts = async (data) => {
    //get all posts in a specific group with privacy check
    const group = await Group.findById(data.groupId)

    if (!group) {
        return { message: 'group not found' }
    }

    //check if group is private and user is not a member
    if (group.privacy === 'private' && !group.members.includes(data.userId)) {
        return { message: 'group posts fetched successfully', posts: [] }
    }

    const groupPosts = await Post.find({ groupId: data.groupId })
        .sort({ createdAt: -1 })
    return {
        message: 'group posts retrieved successfully',
        posts: groupPosts
    }
}

// Check if user is admin of a group
const checkAdmin = async (data) => {
    //check if user is admin of the group
    const checkGroup = await Group.findById(data.groupId);
    if (!checkGroup) {
        return { message: 'group not found', isAdmin: false }
    }

    const isAdmin = checkGroup.admins && checkGroup.admins.includes(data.userId);
    return {
        message: 'admin check completed',
        isAdmin: isAdmin
    }
}

// Get join requests for groups where user is admin
const getJoinRequests = async (data) => {
    //get all join requests for groups where user is admin
    const userGroups = await Group.find({
        $or: [
            { createdBy: data.userId },
            { admins: data.userId }
        ]
    }).populate('joinRequests', 'name email profilePicture');

    const allJoinRequests = [];
    userGroups.forEach(group => {
        if (group.joinRequests && group.joinRequests.length > 0) {
            group.joinRequests.forEach(user => {
                allJoinRequests.push({
                    _id: user._id,
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    groupId: group._id,
                    groupName: group.name,
                    message: `wants to join ${group.name}`
                });
            });
        }
    });

    return {
        message: 'join requests retrieved successfully',
        joinRequests: allJoinRequests
    };
}

// Accept a join request
const acceptJoinRequest = async (data) => {
    //accept a join request - add user to group members
    const acceptGroup = await Group.findByIdAndUpdate(
        data.groupId,
        {
            $pull: { joinRequests: data.requestUserId },
            $addToSet: { members: data.requestUserId },
            $push: { memberJoinDates: { userId: data.requestUserId, joinDate: new Date() } }
        },
        { new: true }
    );

    if (!acceptGroup) {
        return { message: 'group not found' };
    }

    //add group to user's groups array
    await User.findByIdAndUpdate(
        data.requestUserId,
        { $addToSet: { groups: data.groupId } },
        { new: true }
    );

    // Add notification to the user who requested to join
    const adminUser = await User.findById(data.userId);
    console.log('Creating join group approval notification for user:', data.requestUserId);
    console.log('Admin user:', adminUser?.name);
    console.log('Group name:', acceptGroup.name);

    await User.findByIdAndUpdate(
        data.requestUserId,
        {
            $push: {
                notifications: {
                    type: 'joinGroupApproved',
                    fromUserId: data.userId,
                    fromUserName: adminUser.name,
                    fromUserProfilePicture: adminUser.profilePicture,
                    groupId: data.groupId,
                    groupName: acceptGroup.name,
                    message: `Your request to join "${acceptGroup.name}" was approved!`
                }
            }
        }
    );
    console.log('Join group approval notification created successfully');

    return { message: 'join request accepted successfully', group: acceptGroup };
}

// Decline a join request
const declineJoinRequest = async (data) => {
    //decline a join request - remove from join requests
    const declineGroup = await Group.findByIdAndUpdate(
        data.groupId,
        { $pull: { joinRequests: data.requestUserId } },
        { new: true }
    );

    if (!declineGroup) {
        return { message: 'group not found' };
    }

    // Add notification to the user who requested to join
    const declineAdminUser = await User.findById(data.userId);
    await User.findByIdAndUpdate(
        data.requestUserId,
        {
            $push: {
                notifications: {
                    type: 'joinGroupDeclined',
                    fromUserId: data.userId,
                    fromUserName: declineAdminUser.name,
                    fromUserProfilePicture: declineAdminUser.profilePicture,
                    groupId: data.groupId,
                    groupName: declineGroup.name,
                    message: `Your request to join "${declineGroup.name}" was declined.`
                }
            }
        }
    );

    return { message: 'join request declined successfully', group: declineGroup };
}

// Check join request status
const checkJoinRequestStatus = async (data) => {
    //check if user has pending join request for a group
    const checkJoinRequestGroup = await Group.findOne({
        _id: data.groupId,
        joinRequests: data.userId
    });

    return {
        message: 'join request status checked',
        hasPendingRequest: !!checkJoinRequestGroup
    };
}

// Get group statistics
const getGroupStats = async (data) => {
    //get statistics for a specific group (only for admins)
    const statGroup = await Group.findById(data.groupId);

    if (!statGroup) {
        return { message: 'group not found' };
    }

    //check if user is admin
    const isStatAdmin = statGroup.admins && statGroup.admins.includes(data.userId);
    if (!isStatAdmin) {
        return { message: 'unauthorized: only group admins can view statistics', status: 403 };
    }

    //get all posts in the group
    const allPosts = await Post.find({ groupId: data.groupId });

    //calculate top contributors (users with most posts)
    const contributorCounts = {};
    allPosts.forEach(post => {
        if (contributorCounts[post.authorId]) {
            contributorCounts[post.authorId].count++;
        } else {
            contributorCounts[post.authorId] = {
                userId: post.authorId,
                authorName: post.author,
                count: 1,
                profilePicture: post.authorProfilePicture
            };
        }
    });

    //convert to array and sort by count
    const topContributors = Object.values(contributorCounts)
        .sort((a, b) => b.count - a.count)
        //top 5 contributors
        .slice(0, 5);

    //process member join dates for timeline chart
    const joinDates = statGroup.memberJoinDates || [];
    console.log('memberJoinDates:', joinDates);
    console.log('Number of join dates:', joinDates.length);

    //group by month
    const joinDatesByMonth = {};
    joinDates.forEach(({ joinDate }) => {
        const date = new Date(joinDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        joinDatesByMonth[monthKey] = (joinDatesByMonth[monthKey] || 0) + 1;
    });

    //convert to array and sort by date
    const timelineData = Object.entries(joinDatesByMonth)
        .map(([date, count]) => ({
            date,
            joins: count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    console.log('Timeline data:', timelineData);

    const statsResponse = {
        topContributors: topContributors,
        totalPosts: allPosts.length,
        totalMembers: statGroup.members.length,
        memberJoinTimeline: timelineData
    };

    console.log('Stats response being sent:', JSON.stringify(statsResponse, null, 2));

    return {
        message: 'group statistics retrieved successfully',
        stats: statsResponse
    };
}


module.exports = {
    createGroup,
    listGroups,
    searchGroups,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    addAdmin,
    removeAdmin,
    getGroup,
    getGroupPosts,
    checkAdmin,
    getJoinRequests,
    acceptJoinRequest,
    declineJoinRequest,
    checkJoinRequestStatus,
    getGroupStats
}