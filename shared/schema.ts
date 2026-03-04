import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  billId: varchar("bill_id").notNull().unique(),
  hash: varchar("hash").notNull(),
  exporter: text("exporter"),
  importer: text("importer"),
  invoiceNumber: varchar("invoice_number"),
  hsCode: varchar("hs_code"),
  value: varchar("value"),
  ports: text("ports"),
  vesselName: varchar("vessel_name"),
  importingCountry: varchar("importing_country"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
});

export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;
