import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { getCurrentUTCFromIST } from "./date-time";
import { headers } from 'next/headers';


export const globalForPrisma = global as unknown as { prisma: any };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const basePrisma = new PrismaClient({ adapter });

const extendedPrisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const headerList = await headers();
        const ip = headerList.get('x-client-ip') || headerList.get('x-forwarded-for') || "system";
         

        try {
          const result = await query(args);

          if (model !== 'Log_records') {
          
            basePrisma.log_records.create({
              data: {
                table_name: model,
                query: `${operation} with args: ${JSON.stringify(args)}`,
                createdAt: getCurrentUTCFromIST(),
                ip: ip,
              },
            }).catch(err => console.error("Logging failed", err));
          }
          return result;
        } catch (error: any) {
          if (model !== 'Log_records') {
            await basePrisma.log_records.create({
              data: {
                table_name: model,
                query: `${operation} failed. Error: ${error.message}`,
                createdAt: getCurrentUTCFromIST(),
                ip: ip,
              },
            });
          }
          throw error;
        }
      },
    },
  },
});

export const prisma = globalForPrisma.prisma || extendedPrisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;