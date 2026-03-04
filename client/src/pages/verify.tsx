import { useState } from "react";
import { ShieldCheck, Loader2, FileCheck, AlertTriangle, FileText } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { useVerifyBill } from "@/hooks/use-bills";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const verifyMutation = useVerifyBill();

  const handleVerify = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("document", file);
    verifyMutation.mutate(formData);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Verify Document</h1>
        <p className="text-muted-foreground mt-1 text-base">Check a document's cryptographic signature against our secure ledger.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-2 border-border/60 shadow-lg shadow-black/5 rounded-2xl h-fit">
          <div className="bg-primary/5 p-6 border-b border-border/50">
            <div className="flex items-center gap-3 text-primary mb-2">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-xl font-bold font-display">Upload to Verify</h2>
            </div>
            <p className="text-sm text-muted-foreground text-balance">
              Provide the generated PDF. The system will recompute its SHA-256 hash and compare it with the stored value.
            </p>
          </div>
          <CardContent className="p-6">
            <FileUpload 
              label="Select PDF Document" 
              accept=".pdf"
              file={file} 
              onFileSelect={(f) => {
                setFile(f);
                verifyMutation.reset();
              }} 
            />
            
            <Button 
              size="lg" 
              className="w-full mt-6 rounded-xl font-semibold shadow-md transition-all hover:-translate-y-0.5"
              disabled={!file || verifyMutation.isPending}
              onClick={handleVerify}
            >
              {verifyMutation.isPending ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying Hash...</>
              ) : (
                <>Run Verification <ShieldCheck className="w-5 h-5 ml-2" /></>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          {verifyMutation.isIdle && (
            <div className="h-full min-h-[300px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-secondary/10 p-8 text-center">
              <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Awaiting Document</h3>
              <p className="max-w-sm text-sm">Upload a document and run verification to see cryptographic proof and original ledger details here.</p>
            </div>
          )}

          {verifyMutation.isPending && (
            <div className="h-full min-h-[300px] border border-border rounded-2xl flex flex-col items-center justify-center bg-card shadow-sm p-8 text-center animate-pulse">
              <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Computing SHA-256...</h3>
              <p className="text-sm text-muted-foreground mt-2">Checking document integrity against the database.</p>
            </div>
          )}

          {verifyMutation.isSuccess && (
            <Card className={`border-2 shadow-xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${verifyMutation.data.valid ? 'border-green-500/50 shadow-green-900/5' : 'border-destructive/50 shadow-destructive/5'}`}>
              <div className={`p-6 text-white flex items-center gap-4 ${verifyMutation.data.valid ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-destructive to-red-500'}`}>
                {verifyMutation.data.valid ? <FileCheck className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
                <div>
                  <h2 className="text-2xl font-bold font-display">
                    {verifyMutation.data.valid ? "Document is Valid" : "Verification Failed"}
                  </h2>
                  <p className="text-white/90 text-sm font-medium">{verifyMutation.data.message}</p>
                </div>
              </div>
              
              <CardContent className="p-0">
                {verifyMutation.data.valid && verifyMutation.data.bill ? (
                  <div className="p-6">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Original Ledger Record</h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Bill ID</p>
                        <p className="font-mono text-sm font-medium bg-secondary px-2 py-1 rounded inline-block">{verifyMutation.data.bill.billId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Importing Country</p>
                        <Badge variant="outline" className="font-semibold bg-primary/5 text-primary border-primary/20 rounded-md px-3 py-1">
                          {verifyMutation.data.bill.importingCountry}
                        </Badge>
                      </div>
                      
                      <Separator className="col-span-2" />
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Exporter</p>
                        <p className="font-medium text-sm">{verifyMutation.data.bill.exporter || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Importer</p>
                        <p className="font-medium text-sm">{verifyMutation.data.bill.importer || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Invoice Number</p>
                        <p className="font-medium text-sm">{verifyMutation.data.bill.invoiceNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">HS Code</p>
                        <p className="font-medium text-sm">{verifyMutation.data.bill.hsCode || "N/A"}</p>
                      </div>
                      
                      <Separator className="col-span-2" />
                      
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Stored SHA-256 Hash</p>
                        <p className="font-mono text-xs bg-secondary/50 px-3 py-2 rounded text-muted-foreground break-all border border-border/50">
                          {verifyMutation.data.bill.hash}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-destructive/5 text-destructive">
                    <p className="font-semibold">The uploaded document has been modified or does not exist in the system ledger.</p>
                    <p className="text-sm mt-2 opacity-80">Any alteration to the PDF invalidates the cryptographic signature.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
