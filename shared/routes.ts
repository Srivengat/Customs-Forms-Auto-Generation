import { z } from "zod";
import { insertBillSchema, bills } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  bills: {
    list: {
      method: "GET" as const,
      path: "/api/bills" as const,
      responses: {
        200: z.array(z.custom<typeof bills.$inferSelect>()),
      },
    },
    extract: {
      method: "POST" as const,
      path: "/api/bills/extract" as const,
      // Input is multipart/form-data with fields: 'invoice' and 'bol'
      responses: {
        200: z.object({
          exporter: z.string().optional(),
          importer: z.string().optional(),
          invoiceNumber: z.string().optional(),
          hsCode: z.string().optional(),
          value: z.string().optional(),
          ports: z.string().optional(),
          vesselName: z.string().optional(),
        }),
        400: errorSchemas.validation,
      },
    },
    generate: {
      method: "POST" as const,
      path: "/api/bills/generate" as const,
      input: z.object({
        exporter: z.string().optional(),
        importer: z.string().optional(),
        invoiceNumber: z.string().optional(),
        hsCode: z.string().optional(),
        value: z.string().optional(),
        ports: z.string().optional(),
        vesselName: z.string().optional(),
        importingCountry: z.string(),
      }),
      responses: {
        201: z.object({
          billId: z.string(),
          hash: z.string(),
          pdfUrl: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
    verify: {
      method: "POST" as const,
      path: "/api/bills/verify" as const,
      // Input is multipart/form-data with field: 'document' (PDF file)
      responses: {
        200: z.object({
          valid: z.boolean(),
          message: z.string(),
          bill: z.custom<typeof bills.$inferSelect>().optional(),
        }),
        400: errorSchemas.validation,
      },
    },
  },
  health: {
    check: {
      method: "GET" as const,
      path: "/api/health" as const,
      responses: {
        200: z.object({
          status: z.string(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
