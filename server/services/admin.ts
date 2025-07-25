import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Role } from "../../shared/auth.js";

const prisma = new PrismaClient();

export class AdminService {
  private static readonly SALT_ROUNDS = 12;

  // Promouvoir un utilisateur à admin normal
  static async promoteToAdmin(
    userId: string,
    promotedBy: string,
  ): Promise<void> {
    // Vérifier que celui qui promeut est un super admin
    const promoter = await prisma.user.findUnique({
      where: { id: promotedBy },
    });

    if (!promoter || promoter.role !== "SUPER_ADMIN") {
      throw new Error("Seul un super admin peut promouvoir un utilisateur");
    }

    // Promouvoir l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
  }

  // Promouvoir un admin à super admin (très restreint)
  static async promoteToSuperAdmin(
    userId: string,
    promotedBy: string,
  ): Promise<void> {
    // Vérifier que celui qui promeut est un super admin
    const promoter = await prisma.user.findUnique({
      where: { id: promotedBy },
    });

    if (!promoter || promoter.role !== "SUPER_ADMIN") {
      throw new Error("Seul un super admin peut créer un autre super admin");
    }

    // Vérifier que l'utilisateur est déjà admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "ADMIN") {
      throw new Error("Seul un admin peut être promu super admin");
    }

    // Promouvoir à super admin
    await prisma.user.update({
      where: { id: userId },
      data: { role: "SUPER_ADMIN" },
    });
  }

  // Rétrograder un admin (seul super admin peut le faire)
  static async demoteAdmin(userId: string, demotedBy: string): Promise<void> {
    const demoter = await prisma.user.findUnique({
      where: { id: demotedBy },
    });

    if (!demoter || demoter.role !== "SUPER_ADMIN") {
      throw new Error("Seul un super admin peut rétrograder un admin");
    }

    // Ne peut pas se rétrograder soi-même
    if (userId === demotedBy) {
      throw new Error("Un super admin ne peut pas se rétrograder lui-même");
    }

    // Rétrograder à utilisateur normal
    await prisma.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });
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
  static canUserManage(managerRole: Role, targetRole: Role): boolean {
    const hierarchy = this.getPrivilegeHierarchy();
    const managerLevel = hierarchy[managerRole]?.level || 0;
    const targetLevel = hierarchy[targetRole]?.level || 0;

    return managerLevel > targetLevel;
  }

  // Lister tous les admins (seul super admin peut voir cette liste complète)
  static async getAllAdmins(requesterId: string) {
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });

    if (!requester || requester.role !== "SUPER_ADMIN") {
      throw new Error(
        "Seul un super admin peut voir la liste complète des admins",
      );
    }

    return await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "SUPER_ADMIN"],
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: [
        { role: "desc" }, // SUPER_ADMIN en premier
        { createdAt: "asc" },
      ],
    });
  }

  // Créer un admin directement (seul super admin)
  static async createAdmin(
    data: {
      email: string;
      username: string;
      password: string;
      firstName?: string;
      lastName?: string;
      role: "ADMIN" | "SUPER_ADMIN";
    },
    createdBy: string,
  ): Promise<any> {
    const creator = await prisma.user.findUnique({
      where: { id: createdBy },
    });

    if (!creator || creator.role !== "SUPER_ADMIN") {
      throw new Error("Seul un super admin peut créer directement un admin");
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error("Cet email est déjà utilisé");
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw new Error("Ce nom d'utilisateur est déjà pris");
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    // Créer l'admin
    const admin = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
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
