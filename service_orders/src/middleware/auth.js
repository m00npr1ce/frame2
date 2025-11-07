export const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const rolesHeader = req.headers['x-user-roles'];
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'User ID not provided'
      }
    });
  }

  req.userId = userId;
  req.userRoles = rolesHeader ? JSON.parse(rolesHeader) : ['user'];
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.userRoles || !req.userRoles.includes('admin')) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required'
      }
    });
  }
  next();
};


