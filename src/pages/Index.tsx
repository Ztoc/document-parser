import React, { useState } from "react";
import FileUpload from "@/components/FileUpload";
import LoadingIndicator from "@/components/LoadingIndicator";
import DocumentViewer from "@/components/DocumentViewer";
import DocumentAnalysis from "@/components/DocumentAnalysis";
import { parseXmlDocument, organizeHierarchy } from "@/utils/xmlParser";
import { toast } from "sonner";
import { ExternalLink, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface DocumentNode {
  id: string;
  type: "heading" | "paragraph" | "list-item";
  level: number;
  content: string;
  children: DocumentNode[];
  numbering?: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentNodes, setDocumentNodes] = useState<DocumentNode[]>([]);
  const [hasProcessedFile, setHasProcessedFile] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [documentStats, setDocumentStats] = useState({
    paragraphs: 0,
    headings: 0,
    listItems: 0,
  });

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setHasProcessedFile(false);

      const startTime = performance.now();

      // Parse the XML file
      const nodes = await parseXmlDocument(file);

      // Organize parsed content into a hierarchy
      const organizedNodes = organizeHierarchy(nodes);

      // Calculate processing time
      const endTime = performance.now();
      const timeInMs = Math.round(endTime - startTime);
      setProcessingTime(timeInMs);

      // Calculate document statistics
      const stats = {
        paragraphs: nodes.filter((node) => node.type === "paragraph").length,
        headings: nodes.filter((node) => node.type === "heading").length,
        listItems: nodes.filter((node) => node.type === "list-item").length,
      };
      setDocumentStats(stats);

      setDocumentNodes(organizedNodes);
      setHasProcessedFile(true);
      toast.success("Document processed successfully", {
        description: `Processed ${nodes.length} elements from ${file.name}`,
        duration: 4000,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing document", {
        description: (error as Error).message || "Failed to parse the XML file",
      });
      setDocumentNodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border py-4 px-12 bg-background">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Text Lattice Parser</h1>
            <p className="text-muted-foreground text-sm">
              OOXML Document Analysis
            </p>
          </div>
          <a
            href="https://github.com/Ztoc/document-parser"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink size={16} />
            <span>View Source</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Column */}
        <div className="w-full md:w-1/2 border-r border-border overflow-y-auto">
          <div className="py-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">
                Parse OOXML Documents
              </h2>
              <p className="text-muted-foreground">
                Upload a document to analyze its structure and content
              </p>
            </div>

            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />

            <div className="mt-12">
              <h3 className="text-lg font-medium mb-4">About This Parser</h3>
              <p className="text-muted-foreground mb-4">
                This custom OOXML parser accurately replicates document
                structure and numbering without external libraries. It processes
                Office Open XML (exported from Microsoft Word) and displays the
                content in a clean, navigable format.
              </p>

              <div className="bg-background border border-border rounded-lg p-4">
                <h4 className="font-medium mb-3">Key Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="text-primary shrink-0 mt-0.5" size={18} />
                    <span className="text-sm">
                      Custom OOXML parsing without external dependencies
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary shrink-0 mt-0.5" size={18} />
                    <span className="text-sm">
                      Accurate numbering structure reproduction
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary shrink-0 mt-0.5" size={18} />
                    <span className="text-sm">
                      Hierarchical document structure analysis
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-primary shrink-0 mt-0.5" size={18} />
                    <span className="text-sm">
                      Clean, navigable content presentation
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 overflow-y-auto">
          <div className="p-6 h-full flex flex-col">
            <div className="mb-3">
              <h2 className="text-xl font-medium mb-1">Document Preview</h2>
              <p className="text-muted-foreground">
                Upload a document to see its parsed content
              </p>
            </div>

            <div className="flex-1">
              {isLoading ? (
                <LoadingIndicator />
              ) : hasProcessedFile ? (
                <div className="h-full flex flex-col">
                  <Tabs
                    defaultValue="document"
                    className="w-full h-full flex flex-col"
                  >
                    <TabsList className="inline-flex h-12 items-center justify-start rounded-lg bg-muted/20 p-1">
                      <TabsTrigger
                        value="document"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-muted/50"
                      >
                        Document View
                      </TabsTrigger>
                      <TabsTrigger
                        value="analysis"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-muted/50"
                      >
                        Analysis View
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="document"
                      className="flex-1 h-full mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <DocumentViewer documentNodes={documentNodes} />
                    </TabsContent>

                    <TabsContent
                      value="analysis"
                      className="flex-1 h-full mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <DocumentAnalysis
                        stats={documentStats}
                        processingTime={processingTime || 0}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="border border-border rounded-lg h-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Upload a document to view its content
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 bg-background">
        <div className="container mx-auto flex justify-between items-center text-sm text-muted-foreground">
          <div>Text Lattice Parser — Custom OOXML Processing</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
