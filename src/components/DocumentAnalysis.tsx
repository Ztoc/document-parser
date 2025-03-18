import React from "react";
import { FileText, Heading1, List, Clock } from "lucide-react";

interface DocumentAnalysisProps {
  stats: {
    paragraphs: number;
    headings: number;
    listItems: number;
  };
  processingTime: number;
}

const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({
  stats,
  processingTime,
}) => {
  return (
    <div className="flex flex-col h-full w-full border border-border rounded-lg bg-white overflow-auto">
      <div className="p-6 space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">Document Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground text-sm">
                  Paragraphs
                </span>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-4xl font-semibold">{stats.paragraphs}</p>
            </div>

            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground text-sm">Headings</span>
                <Heading1 className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-4xl font-semibold">{stats.headings}</p>
            </div>

            <div className="bg-background rounded-lg border border-border p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground text-sm">
                  List Items
                </span>
                <List className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-4xl font-semibold">{stats.listItems}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Processing Information</h2>
          <div className="bg-background rounded-lg border border-border p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Processing Time</span>
              <span className="font-medium">{processingTime} ms</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Structure Overview</h2>
          <div className="bg-background rounded-lg border border-border p-4">
            <p className="text-muted-foreground mb-4">
              This document contains {stats.headings} headings forming the
              document structure,
              {stats.paragraphs} paragraphs of content, and {stats.listItems}{" "}
              numbered or bulleted list items.
            </p>

            <h3 className="font-medium mb-2">Parsing Approach</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-small">•</span>
                <span>Custom parsing of OOXML structure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-small">•</span>
                <span>Extraction of document hierarchical structure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-small">•</span>
                <span>Accurate reproduction of numbering formats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-small">•</span>
                <span>Identification of content types and styling</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DocumentAnalysis;
