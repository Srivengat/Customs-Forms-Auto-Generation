import { useBills } from "@/hooks/use-bills";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileDown, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const { data: bills, isLoading } = useBills();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Generation History</h1>
        <p className="text-muted-foreground mt-1 text-base">Complete ledger of all processed and generated customs declarations.</p>
      </div>

      <Card className="border-border/60 shadow-lg shadow-black/5 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-10 h-10 mb-4 animate-spin text-primary" />
            <p className="font-medium">Loading ledger records...</p>
          </div>
        ) : bills && bills.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Date</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Bill ID</TableHead>
                  <TableHead className="font-semibold text-foreground">Parties</TableHead>
                  <TableHead className="font-semibold text-foreground whitespace-nowrap">Destination</TableHead>
                  <TableHead className="font-semibold text-foreground">Value</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id} className="hover:bg-secondary/20 transition-colors group">
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {bill.createdAt ? format(new Date(bill.createdAt), "MMM d, yyyy HH:mm") : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs bg-secondary px-2 py-1 rounded font-medium border border-border/50 group-hover:border-primary/20 transition-colors">
                        {bill.billId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-medium text-sm truncate" title={bill.exporter || "Unknown"}>
                          <span className="text-xs text-muted-foreground mr-1">Exp:</span> {bill.exporter || "-"}
                        </span>
                        <span className="font-medium text-sm truncate" title={bill.importer || "Unknown"}>
                          <span className="text-xs text-muted-foreground mr-1">Imp:</span> {bill.importer || "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                        {bill.importingCountry || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {bill.value || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {bill.pdfUrl ? (
                        <Button variant="ghost" size="sm" className="rounded-lg h-8 px-3" asChild>
                          <a href={bill.pdfUrl} target="_blank" rel="noreferrer">
                            <FileDown className="w-4 h-4 mr-1.5" /> PDF
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Unavailable</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-muted-foreground bg-secondary/5">
            <HistoryIcon className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Records Found</h3>
            <p className="text-sm">Generate your first customs bill to see it in the history ledger.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
