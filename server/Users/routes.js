import * as userDao from "./dao.js";

export default function UserRoutes(app) {
  // ============ AUTH ROUTES ============

  // Sign up
  app.post("/api/users/signup", async (req, res) => {
    try {
      const existingUser = await userDao.findUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already in use" });
      }

      const newUser = await userDao.createUser(req.body);
      req.session["currentUser"] = newUser;
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error signing up:", error);
      res.status(500).json({ error: "Failed to sign up" });
    }
  });

  // Sign in
  app.post("/api/users/signin", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userDao.findUserByCredentials(username, password);

      if (user) {
        req.session["currentUser"] = user;
        res.json(user);
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error signing in:", error);
      res.status(500).json({ error: "Failed to sign in" });
    }
  });

  // Sign out
  app.post("/api/users/signout", (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  });

  // Get profile (current user) - MOVED BEFORE /:userId
  app.get("/api/users/profile", (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(currentUser);
  });

  // ============ GENERIC USER ROUTES ============

  // Get all users OR filter by role/name
  app.get("/api/users", async (req, res) => {
    try {
      const { role, name } = req.query;

      if (role && name) {
        const users = await userDao.findUsersByRoleAndName(role, name);
        return res.json(users);
      }

      if (role) {
        const users = await userDao.findUsersByRole(role);
        return res.json(users);
      }

      if (name) {
        const users = await userDao.findUsersByPartialName(name);
        return res.json(users);
      }

      const users = await userDao.findAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Get user by ID
  app.get("/api/users/:userId", async (req, res) => {
    try {
      const user = await userDao.findUserById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Create user (admin)
  app.post("/api/users", async (req, res) => {
    try {
      const user = await userDao.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Update user
  app.put("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      await userDao.updateUser(userId, req.body);
      const updatedUser = await userDao.findUserById(userId);

      const currentUser = req.session["currentUser"];
      if (currentUser && currentUser._id === userId) {
        req.session["currentUser"] = updatedUser;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Delete user
  app.delete("/api/users/:userId", async (req, res) => {
    try {
      const result = await userDao.deleteUser(req.params.userId);
      res.json(result);
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // ============ FAVORITES ROUTES ============
  
  // Add favorite
  app.post("/api/users/:userId/favorites/:turfId", async (req, res) => {
    try {
      const { userId, turfId } = req.params;
      const currentUser = req.session["currentUser"];
      
      if (!currentUser || currentUser._id !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      await userDao.addFavorite(userId, turfId);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  // Remove favorite
  app.delete("/api/users/:userId/favorites/:turfId", async (req, res) => {
    try {
      const { userId, turfId } = req.params;
      const currentUser = req.session["currentUser"];
      
      if (!currentUser || currentUser._id !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      await userDao.removeFavorite(userId, turfId);
      res.sendStatus(200);
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  // Get user's favorites
  app.get("/api/users/:userId/favorites", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await userDao.getFavorites(userId);
      res.json(user?.favoriteTurfs || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  // Check if turf is favorite
  app.get("/api/users/:userId/favorites/:turfId/check", async (req, res) => {
    try {
      const { userId, turfId } = req.params;
      const isFav = await userDao.isFavorite(userId, turfId);
      res.json({ isFavorite: isFav });
    } catch (error) {
      res.status(500).json({ error: "Failed to check favorite" });
    }
  });

  // ============ PUBLIC PROFILE ============
  
  app.get("/api/users/:userId/public", async (req, res) => {
    try {
      const user = await userDao.findUserById(req.params.userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Return only public information
      const publicProfile = {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt
      };
      
      res.json(publicProfile);
    } catch (error) {
      console.error("Error fetching public profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });
}