

import prisma from "@/lib/prisma/prismaClient";
import { AddDepartmentData, DepartmentResult } from "./types";
import { NotFoundError, UnauthorizedError } from "@/lib/error-handler/customeErrors";
import { throwAppropriateError } from "@/lib/error-handler/throwError";
import { Prisma } from "@prisma/client";
import { DepartmentType } from "@/app/types/constant";

/**
 * Updates the department identified by the company and department type.
 */
export async function updateDepartment(
  companyId: string,
  departmentType: DepartmentType,
  data: AddDepartmentData
): Promise<DepartmentResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // First find the department using non-unique fields.
      const existingDepartment = await prisma.department.findFirst({
        where: { departmentCompanyId: companyId, departmentType },
        select: { departmentId: true }
      });
      if (!existingDepartment) {
        throw new NotFoundError("Department not found");
      }
      const departmentId = existingDepartment.departmentId;

      // Build update data
      const updateData: Prisma.DepartmentUpdateInput = {};
      if (data.departmentName !== undefined) {
        updateData.departmentName = data.departmentName;
      }
      if (data.departmentType !== undefined) {
        updateData.departmentType = data.departmentType;
      }
      if (Array.isArray(data.managerAccess)) {
        const newManagerIds = data.managerAccess
          .filter(ma => ma.managerId !== "") // Filter out empty IDs
          .map(ma => ({ managerId: ma.managerId }));
        updateData.departmentManagers = {
          deleteMany: {}, // Remove all existing relationships
          create: newManagerIds,
        };
      }

      let department;
      if (Object.keys(updateData).length > 0) {
        // Update the department
        department = await prisma.department.update({
          where: { departmentId },
          data: updateData,
          select: {
            departmentId: true, // now selected so that our DepartmentResult type is fulfilled
            departmentType: true,
            departmentName: true,
            departmentJsons: true,
            departmentConnections: {
              select: { databaseConnectionConnectionString: true }
            },
          }
        });
      } else {
        // No update data: simply fetch the department
        department = await prisma.department.findUnique({
          where: { departmentId },
          select: {
            departmentId: true,
            departmentType: true,
            departmentName: true,
            departmentJsons: true,
            departmentConnections: {
              select: { databaseConnectionConnectionString: true }
            },
          }
        });
      }
      return { Department: department };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

/**
 * Retrieves a department after validating that the given manager has access.
 */
export async function getDepartmentById(
  companyId: string,
  departmentType: DepartmentType,
  managerId: string,
  role:string
): Promise<DepartmentResult> {
  try {
    const existingDepartment = await prisma.department.findFirst({
      where: { departmentType, departmentCompanyId: companyId },
      select: {
        departmentId: true,
        departmentType: true,
        departmentName: true,
        departmentJsons: { select: { json: true } },
        departmentConnections: { select: { databaseConnectionConnectionString: true } },
        departmentCompanyId: true, // For company check
        departmentManagers: { select: { managerId: true } } // For access check
      }
    });

    if (!existingDepartment || existingDepartment.departmentCompanyId !== companyId) {
      throw new NotFoundError("Département non trouvé");
    }

    // Check that the manager has access to the department.
    const hasAccess = existingDepartment.departmentManagers.some(
      (access) => access.managerId === managerId
    );
    if (!hasAccess && role !=="admin") {
      throw new UnauthorizedError("Vous n'êtes pas autorisé à consulter ce département");
    }

    // Remove security fields from the returned object.
    const { departmentCompanyId, departmentManagers, ...departmentData } = existingDepartment;
    console.log(departmentCompanyId,departmentManagers)
    return { Department: departmentData };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

/**
 * Deletes a department.
 * (Note: To uniquely delete a department, we first find it by companyId and type.)
 */
export async function deleteDepartment(
  companyId: string,
  departmentType: DepartmentType
): Promise<DepartmentResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // First, find the department so that we can delete by its unique ID.
      const existingDepartment = await prisma.department.findFirst({
        where: { departmentCompanyId: companyId, departmentType },
        select: { departmentId: true }
      });
      if (!existingDepartment) {
        throw new NotFoundError("Department not found");
      }
      const department = await prisma.department.delete({
        where: { departmentId: existingDepartment.departmentId },
        select: {
          departmentId: true,
          departmentType: true,
          departmentName: true,
          departmentJsons: true,
          departmentConnections: {
            select: { databaseConnectionConnectionString: true }
          },
        }
      });
      return { Department: department };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
