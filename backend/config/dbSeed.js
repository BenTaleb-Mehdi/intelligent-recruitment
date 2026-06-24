const bcrypt = require('bcryptjs');
const Role = require('../Models/Role');
const User = require('../Models/User');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Database Seeding...');

    // 1. Seed Roles
    const rolesData = [
      {
        name: 'ROLE_ADMIN',
        description: 'Superuser with full system access',
        permissions: ['CAN_MANAGE_ROLES', 'CAN_VIEW_METRICS', 'CAN_MODERATE', 'CAN_VIEW_JOBS', 'CAN_APPLY_JOBS']
      },
      {
        name: 'ROLE_CANDIDAT',
        description: 'Candidate role to apply for jobs and manage portfolio',
        permissions: ['CAN_VIEW_JOBS', 'CAN_APPLY_JOBS', 'CAN_MANAGE_PROFILE']
      },
      {
        name: 'ROLE_RECRUTEUR',
        description: 'Recruiter role to post job offers and view analytics',
        permissions: ['CAN_POST_JOBS', 'CAN_VIEW_APPLICATIONS', 'CAN_MANAGE_PROFILE']
      }
    ];

    const seededRoles = {};
    for (const r of rolesData) {
      let roleDoc = await Role.findOne({ name: r.name });
      if (!roleDoc) {
        roleDoc = await Role.create(r);
        console.log(`✅ Created Role: ${r.name}`);
      } else {
        // Sync permissions just in case
        roleDoc.permissions = r.permissions;
        roleDoc.description = r.description;
        await roleDoc.save();
      }
      seededRoles[r.name] = roleDoc;
    }

    // 2. Seed Default Admin User
    const adminEmail = 'admin@recruitment.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const defaultPassword = 'Admin123!';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      adminUser = await User.create({
        email: adminEmail,
        passwordHash,
        roles: [seededRoles['ROLE_ADMIN']._id]
      });

      console.log(`👑 Seeded Default Admin User: ${adminEmail} (password: ${defaultPassword})`);
    } else {
      // Ensure admin has ROLE_ADMIN
      const adminRoleId = seededRoles['ROLE_ADMIN']._id;
      if (!adminUser.roles.includes(adminRoleId)) {
        adminUser.roles.push(adminRoleId);
        await adminUser.save();
      }
    }

    console.log('🌿 Database Seeding Completed Successfully.');
  } catch (error) {
    console.error('🚨 Error during Database Seeding:', error);
  }
};

module.exports = seedDatabase;
