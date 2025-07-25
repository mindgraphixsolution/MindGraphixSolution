import bcrypt from "bcrypt";
import { db, User } from "./database";

type UserRole = "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";

export class AdminService {
  private static readonly SALT_ROUNDS = 12;

  // Promouvoir un utilisateur à admin normal
  static async promoteToAdmin(
    userId: string,
    promotedBy: string,
  ): Promise<void> {
    // Vérifier que celui qui promeut est un super admin
    const promoter = await db.findUserById(promotedBy);

    if (!promoter || promoter.role !== "SUPER_ADMIN") {
      throw new Error("Seul un super admin peut promouvoir un utilisateur");
    }

    // Promouvoir l'utilisateur
    await db.updateUser(userId, { role: "ADMIN" });
  }

  // Promouvoir un admin à super admin (très restreint)
  static async promoteToSuperAdmin(
    userId: string,
    promotedBy: string,
  ): Promise<void> {
    // Vérifier que celui qui promeut est un super admin
    const promoter = await db.findUserById(promotedBy);

    if (!promoter || promoter.role !== "SUPER_ADMIN") {
      throw new Error("Seul un super admin peut créer un autre super admin");
    }

    // Vérifier que l'utilisateur est déjà admin
    const user = await db.findUserById(userId);

    if (!user || user.role !== "ADMIN") {
      throw new Error("Seul un admin peut être promu super admin");
    }

    // Promouvoir à super admin
    await db.updateUser(userId, { role: "SUPER_ADMIN" });
  }

  // Rétrograder un admin (seul super admin peut le faire)
  static async demoteAdmin(userId: string, demotedBy: string): Promise<void> {
    const demoter = await db.findUserById(demotedBy);

    if (!demoter || demoter.role !== "SUPER_ADMIN") {
      throw new Error("Seul un super admin peut rétrograder un admin");
    }

    // Ne peut pas se rétrograder soi-même
    if (userId === demotedBy) {
      throw new Error("Un super admin ne peut pas se rétrograder lui-même");
    }

    // Rétrograder à utilisateur normal
    await db.updateUser(userId, { role: "USER" });
  }

  // Obtenir la hiérarchie des privilèges
  static getPrivilegeHierarchy() {
    return {
      SUPER_ADMIN: {
        level: 4,
        description: "Privilèges maximum - Contrôle total du système",
        canManage: ["USER", "MODERATOR", "ADMIN"],
        canPromote: true,
        canDemote: true,
        canAccessSystem: true,
      },
      ADMIN: {
        level: 3,
        description: "Administrateur normal - Gestion des utilisateurs",
        canManage: ["USER", "MODERATOR"],
        canPromote: false,
        canDemote: false,
        canAccessSystem: false,
      },
      MODERATOR: {
        level: 2,
        description: "Modérateur - Gestion du contenu",
        canManage: ["USER"],
        canPromote: false,
        canDemote: false,
        canAccessSystem: false,
      },
      USER: {
        level: 1,
        description: "Utilisateur standard",
        canManage: [],
        canPromote: false,
        canDemote: false,
        canAccessSystem: false,
      },
    };
  }

  // Vérifier si un utilisateur peut gérer un autre
  static canUserManage(managerRole: UserRole, targetRole: UserRole): boolean {
    const hierarchy = this.getPrivilegeHierarchy();
    const managerLevel = hierarchy[managerRole]?.level || 0;
    const targetLevel = hierarchy[targetRole]?.level || 0;

    return managerLevel > targetLevel;
  }

  // Lister tous les admins (seul super admin peut voir cette liste complète)
  static async getAllAdmins(requesterId: string) {
    const requester = await db.findUserById(requesterId);

    if (!requester || requester.role !== "SUPER_ADMIN") {
      throw new Error(
        "Seul un super admin peut voir la liste complète des admins",
      );
    }

    const users = await db.findManyUsers();
    const admins = users.filter(user => 
      user.role === "ADMIN" || user.role === "SUPER_ADMIN"
    );

    // Trier par rôle (SUPER_ADMIN en premier) puis par date de création
    admins.sort((a, b) => {
      if (a.role === "SUPER_ADMIN" && b.role !== "SUPER_ADMIN") return -1;
      if (a.role !== "SUPER_ADMIN" && b.role === "SUPER_ADMIN") return 1;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return admins.map(admin => ({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role,
      createdAt: admin.createdAt,
    }));
  }

  // Créer un admin directement (seul super admin)
  static async createAdmin(
    data: {
      email: string;
      username: string;
      password: string;
      role: "ADMIN" | "SUPER_ADMIN";
    },
    createdBy: string,
  ): Promise<any> {
    const creator = await db.findUserById(createdBy);

    if (!creator || creator.role !== "SUPER_ADMIN") {
      throw new Error("Seul un super admin peut créer directement un admin");
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await db.findUserByEmail(data.email);

    if (existingEmail) {
      throw new Error("Cet email est déjà utilisé");
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await db.findUserByUsername(data.username);

    if (existingUsername) {
      throw new Error("Ce nom d'utilisateur est déjà pris");
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    // Créer l'admin
    const admin = await db.createUser({
      email: data.email,
      username: data.username,
      password: hashedPassword,
      role: data.role,
    });

    return {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role,
      createdAt: admin.createdAt,
    };
  }
}
