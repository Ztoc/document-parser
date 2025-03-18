import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DocumentNode {
  id: string;
  type: "heading" | "paragraph" | "list-item";
  level: number;
  content: string;
  children: DocumentNode[];
  numbering?: string;
}

interface DocumentViewerProps {
  documentNodes: DocumentNode[];
}

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documentNodes }) => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expandedHeadings, setExpandedHeadings] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    // Animate in after mounting
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Set initial expanded state for all top-level headings
    const initialExpandedState: Record<string, boolean> = {};
    documentNodes.forEach((node) => {
      if (node.type === "heading" && node.level === 1) {
        initialExpandedState[node.id] = true;
      }
    });
    setExpandedHeadings(initialExpandedState);

    return () => clearTimeout(timer);
  }, [documentNodes]);

  const toggleHeading = (id: string) => {
    setExpandedHeadings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Render a document node
  const renderNode = (node: DocumentNode) => {
    const { id, type, level, content, children, numbering } = node;
    const headingLevel = `h${Math.min(level, 6)}` as HeadingLevel;
    const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;
    const isExpandable = children.length > 0;
    const isExpanded = expandedHeadings[id] || false;

    switch (type) {
      case "heading":
        return (
          <div key={id} className="mb-3">
            {isExpandable ? (
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleHeading(id)}
              >
                <div className="flex items-start">
                  <CollapsibleTrigger className="flex items-center gap-1 rounded hover:bg-muted mr-1">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                  <HeadingTag
                    className={cn(
                      "document-heading",
                      level === 1 && "font-semibold"
                    )}
                  >
                    {numbering && (
                      <span className="document-heading-number">
                        {numbering}
                      </span>
                    )}
                    <span>{content}</span>
                  </HeadingTag>
                </div>
                <CollapsibleContent>
                  <div className={cn("ml-4 mt-1", level === 1 && "ml-6")}>
                    {children.map(renderNode)}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <HeadingTag
                className={cn(
                  "document-heading ml-6",
                  level === 1 && "font-semibold"
                )}
              >
                {numbering && (
                  <span className="document-heading-number">{numbering}</span>
                )}
                <span>{content}</span>
              </HeadingTag>
            )}
          </div>
        );

      case "list-item":
        return (
          <div key={id} className="document-list-item">
            <span className="document-list-bullet mt-0.5">
              {numbering || "•"}
            </span>
            <span className="flex-1">{content}</span>
            {children.length > 0 && (
              <div className="ml-6 mt-1 w-full">{children.map(renderNode)}</div>
            )}
          </div>
        );

      case "paragraph":
      default:
        return (
          <div key={id}>
            <p className="document-paragraph">{content}</p>
            {children.length > 0 && (
              <div className="ml-4 mt-1">{children.map(renderNode)}</div>
            )}
          </div>
        );
    }
  };

  if (documentNodes.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "w-full h-full border border-border rounded-lg transition-all duration-500 flex-1",
        "transform bg-white",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <ScrollArea className="h-full w-full">
        <div className="p-6" ref={contentRef}>
          {documentNodes.map(renderNode)}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DocumentViewer;
