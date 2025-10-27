
const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/groupController");

//endpoint to create a new group
router.post("/create", async (req, res) => {
    try {
        const result = await createGroup(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating group:', error: error.message });
    }
});

//endpoint to list all groups
router.get("/list", async (req, res) => {
    try {
        const result = await listGroups(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error listing groups:', error: error.message });
    }
});

//endpoint to search for groups
router.get("/search", async (req, res) => {
    try {
        const result = await searchGroups(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error searching groups:', error: error.message });
    }
});

//endpoint to update a group
router.put("/update", async (req, res) => {
    try {
        const result = await updateGroup(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating group:', error: error.message });
    }
});

//endpoint to delete a group
router.delete("/delete", async (req, res) => {
    try {
        const result = await deleteGroup(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting group:', error: error.message });
    }
});

//endpoint to join a group
router.post("/join", async (req, res) => {
    try {
        const result = await joinGroup(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error joining group:', error: error.message });
    }
});

//endpoint to leave a group
router.delete("/leave", async (req, res) => {
    try {
        const result = await leaveGroup(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error leaving group:', error: error.message });
    }
});

//endpoint to add an admin to a group
router.put("/add-admin", async (req, res) => {
    try {
        const result = await addAdmin(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding admin:', error: error.message });
    }
});

//endpoint to remove an admin from a group
router.delete("/remove-admin", async (req, res) => {
    try {
        const result = await removeAdmin(req.body);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error removing admin:', error: error.message });
    }
});

//endpoint to get a group
router.get("/get", async (req, res) => {
    try {
        const result = await getGroup(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting group:', error: error.message });
    }
});

//endpoint to get posts for a group
router.get("/posts", async (req, res) => {
    try {
        const result = await getGroupPosts(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting group posts:', error: error.message });
    }
});

//endpoint to check if a user is an admin of a group
router.get("/check-admin", async (req, res) => {
    try {
        const result = await checkAdmin(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error checking admin status:', error: error.message });
    }
});

//endpoint to get join requests for a group
router.get("/join-requests", async (req, res) => {
    try {
        const result = await getJoinRequests(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting join requests:', error: error.message });
    }
});

//endpoint to accept a join request for a group
router.post("/accept-join-request", async (req, res) => {
    try {
        const result = await acceptJoinRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error accepting join request:', error: error.message });
    }
});

//endpoint to decline a join request for a group
router.delete("/decline-join-request", async (req, res) => {
    try {
        const result = await declineJoinRequest(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error declining join request:', error: error.message });
    }
});

//endpoint to check if a user has a pending join request for a group
router.get("/check-join-request-status", async (req, res) => {
    try {
        const result = await checkJoinRequestStatus(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error checking join request status:', error: error.message });
    }
});

//endpoint to get statistics for a group
router.get("/stats", async (req, res) => {
    try {
        const result = await getGroupStats(req.query);
        if (result.status) {
            return res.status(result.status).json(result);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error getting group stats:', error: error.message });
    }
});

module.exports = router;