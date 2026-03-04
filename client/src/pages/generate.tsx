import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileUpload } from "@/components/file-upload";
import { useExtractBill, useGenerateBill } from "@/hooks/use-bills";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, CheckCircle2, FileDown, ScanLine, Edit3 } from "lucide-react";
import { api } from "@shared/routes";

const formSchema = api.bills.generate.input;
type FormValues = z.infer<typeof formSchema>;

export default function GeneratePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [bolFile, setBolFile] = useState<File | null>(null);
  const [generatedPdf, setGeneratedPdf] = useState<{ url: string; id: string; hash: string } | null>(null);

  const extractMutation = useExtractBill();
  const generateMutation = useGenerateBill();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exporter: "",
      importer: "",
      invoiceNumber: "",
      hsCode: "",
      value: "",
      ports: "",
      vesselName: "",
      importingCountry: "",
    },
  });

  const handleExtract = async () => {
    if (!invoiceFile || !bolFile) return;
    
    const formData = new FormData();
    formData.append("invoice", invoiceFile);
    formData.append("bol", bolFile);

    try {
      const data = await extractMutation.mutateAsync(formData);
      form.reset({
        exporter: data.exporter || "",
        importer: data.importer || "",
        invoiceNumber: data.invoiceNumber || "",
        hsCode: data.hsCode || "",
        value: data.value || "",
        ports: data.ports || "",
        vesselName: data.vesselName || "",
        importingCountry: "", // Require user to select
      });
      setStep(2);
    } catch (err) {
      // Handled by mutation toast
    }
  };

  const handleGenerate = async (values: FormValues) => {
    try {
      const data = await generateMutation.mutateAsync(values);
      setGeneratedPdf({ url: data.pdfUrl, id: data.billId, hash: data.hash });
      setStep(3);
    } catch (err) {
      // Handled by mutation toast
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Generate Customs Bill</h1>
          <p className="text-muted-foreground mt-1 text-base">Extract data from documents to construct standardized declarations.</p>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-card p-2 rounded-full border border-border shadow-sm">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                ${step === s ? 'bg-primary text-primary-foreground shadow-md' : step > s ? 'bg-green-100 text-green-700' : 'bg-secondary text-muted-foreground'}
              `}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-6 h-[2px] mx-1 rounded-full ${step > s ? 'bg-green-200' : 'bg-border'}`} />}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <Card className="border-border/60 shadow-lg shadow-black/5 rounded-2xl overflow-hidden">
          <div className="bg-primary/5 p-6 border-b border-border/50">
            <div className="flex items-center gap-3 text-primary mb-2">
              <ScanLine className="w-6 h-6" />
              <h2 className="text-xl font-bold font-display">Document Extraction</h2>
            </div>
            <p className="text-sm text-muted-foreground text-balance">
              Upload the Commercial Invoice and Bill of Lading. Our OCR engine will automatically extract key shipment data and structure it for review.
            </p>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FileUpload 
                label="1. Commercial Invoice" 
                file={invoiceFile} 
                onFileSelect={setInvoiceFile} 
              />
              <FileUpload 
                label="2. Bill of Lading" 
                file={bolFile} 
                onFileSelect={setBolFile} 
              />
            </div>
            
            <div className="mt-10 flex justify-end">
              <Button 
                size="lg" 
                className="rounded-xl px-8 shadow-primary/25 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-semibold"
                disabled={!invoiceFile || !bolFile || extractMutation.isPending}
                onClick={handleExtract}
              >
                {extractMutation.isPending ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing OCR...</>
                ) : (
                  <>Extract Data <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-border/60 shadow-lg shadow-black/5 rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-primary/5 p-6 border-b border-border/50 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 text-primary mb-2">
                <Edit3 className="w-6 h-6" />
                <h2 className="text-xl font-bold font-display">Review & Correct</h2>
              </div>
              <p className="text-sm text-muted-foreground text-balance">
                Please verify the extracted information below and select the importing country.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setStep(1)} className="rounded-lg">
              Back
            </Button>
          </div>
          
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exporter Details</Label>
                  <Input {...form.register("exporter")} className="h-12 rounded-xl bg-slate-50 focus:bg-white transition-colors" placeholder="Company Name" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Importer Details</Label>
                  <Input {...form.register("importer")} className="h-12 rounded-xl bg-slate-50 focus:bg-white transition-colors" placeholder="Company Name" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Invoice Number</Label>
                  <Input {...form.register("invoiceNumber")} className="h-12 rounded-xl bg-slate-50 focus:bg-white transition-colors" placeholder="INV-XXXXX" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">HS Code</Label>
                  <Input {...form.register("hsCode")} className="h-12 rounded-xl bg-slate-50 focus:bg-white transition-colors" placeholder="0000.00.00" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Value</Label>
                  <Input {...form.register("value")} className="h-12 rounded-xl bg-slate-50 focus:bg-white transition-colors" placeholder="$10,000 USD" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ports</Label>
                  <Input {...form.register("ports")} className="h-12 rounded-xl bg-slate-50 focus:bg-white transition-colors" placeholder="Origin -> Destination" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vessel Name</Label>
                  <Input {...form.register("vesselName")} className="h-12 rounded-xl bg-slate-50 focus:bg-white transition-colors" placeholder="Ocean Voyager V1" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-primary">Importing Country *</Label>
                  <Select onValueChange={(val) => form.setValue("importingCountry", val)} defaultValue={form.getValues("importingCountry")}>
                    <SelectTrigger className={`h-12 rounded-xl transition-colors ${form.formState.errors.importingCountry ? 'border-destructive ring-destructive' : 'bg-slate-50 focus:bg-white'}`}>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">United States (USA)</SelectItem>
                      <SelectItem value="EU">European Union (EU)</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.importingCountry && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.importingCountry.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="rounded-xl px-8 font-semibold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Final PDF...</>
                  ) : (
                    <>Generate Customs Bill <FileDown className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 3 && generatedPdf && (
        <Card className="border-border/60 shadow-xl shadow-green-900/5 rounded-2xl overflow-hidden bg-gradient-to-br from-white to-green-50/30 animate-in zoom-in-95 duration-500">
          <CardContent className="p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Generation Successful</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              The standardized customs bill has been generated, cryptographically hashed, and securely stored.
            </p>
            
            <div className="bg-white border border-border rounded-xl p-6 w-full max-w-md space-y-4 mb-8 shadow-sm">
              <div className="flex flex-col items-start gap-1 text-left">
                <span className="text-xs uppercase font-bold text-muted-foreground">Bill ID</span>
                <span className="font-mono text-sm font-medium bg-secondary px-2 py-1 rounded">{generatedPdf.id}</span>
              </div>
              <div className="flex flex-col items-start gap-1 text-left">
                <span className="text-xs uppercase font-bold text-muted-foreground">SHA-256 Signature</span>
                <span className="font-mono text-xs text-muted-foreground break-all bg-secondary/50 px-2 py-1 rounded w-full">{generatedPdf.hash}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-xl font-semibold border-primary/20 hover:bg-primary/5"
                onClick={() => {
                  setStep(1);
                  setInvoiceFile(null);
                  setBolFile(null);
                  form.reset();
                }}
              >
                Create Another
              </Button>
              <Button 
                size="lg" 
                className="rounded-xl font-semibold shadow-lg shadow-primary/20"
                asChild
              >
                <a href={generatedPdf.url} target="_blank" rel="noreferrer">
                  <FileDown className="w-5 h-5 mr-2" />
                  Download PDF
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
