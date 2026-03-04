import { bills, type Bill, type InsertBill } from "@shared/schema";

export interface IStorage {
  getBills(): Promise<Bill[]>;
  getBill(id: number): Promise<Bill | undefined>;
  getBillByHash(hash: string): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
}

export class MemStorage implements IStorage {
  private billsMap: Map<number, Bill> = new Map();
  private nextId = 1;

  async getBills(): Promise<Bill[]> {
    return Array.from(this.billsMap.values()).sort((a, b) => {
      const aTime = a.createdAt ? a.createdAt.getTime() : 0;
      const bTime = b.createdAt ? b.createdAt.getTime() : 0;
      return aTime - bTime;
    });
  }

  async getBill(id: number): Promise<Bill | undefined> {
    return this.billsMap.get(id);
  }

  async getBillByHash(hash: string): Promise<Bill | undefined> {
    return Array.from(this.billsMap.values()).find(b => b.hash === hash);
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const id = this.nextId++;
    const newBill: Bill = {
      ...bill,
      id,
      createdAt: new Date(),
      exporter: bill.exporter ?? null,
      importer: bill.importer ?? null,
      invoiceNumber: bill.invoiceNumber ?? null,
      hsCode: bill.hsCode ?? null,
      value: bill.value ?? null,
      ports: bill.ports ?? null,
      vesselName: bill.vesselName ?? null,
      importingCountry: bill.importingCountry ?? null,
      pdfUrl: bill.pdfUrl ?? null,
    };
    this.billsMap.set(id, newBill);
    return newBill;
  }
}

export const storage = new MemStorage();
