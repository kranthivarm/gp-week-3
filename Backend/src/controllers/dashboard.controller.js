const pool = require("../config/db");

exports.DataOfDashBD = async (req, res) => {
  const tenantId = req.user.tenantId;
  const role = req.user.role;

  
  const projectsResult = await pool.query(
    `SELECT COUNT(*) FROM projects WHERE tenant_id = $1 AND status = 'active'`,
    [tenantId]
  );

  
  const tasksResult = await pool.query(
    `
    SELECT COUNT(*)
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE p.tenant_id = $1
    `,
    [tenantId]
  );

  
  let usersCount = null;
  if (role === "tenant_admin") {
    const usersResult = await pool.query(
      `SELECT COUNT(*) FROM users WHERE tenant_id = $1 AND is_active = true`,
      [tenantId]
    );
    usersCount = usersResult.rows[0].count;
  }

  res.json({
    success: true,
    data: {
      projects: projectsResult.rows[0].count,
      tasks: tasksResult.rows[0].count,
      users: usersCount, 
    },
  });
};
