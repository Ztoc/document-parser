interface DocumentNode {
  id: string;
  type: "heading" | "paragraph" | "list-item";
  level: number;
  content: string;
  children: DocumentNode[];
  numbering?: string;
}

// Parse XML document and return structured content
export const parseXmlDocument = async (file: File): Promise<DocumentNode[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file");
        }

        const xmlContent = event.target.result as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

        // Check for parsing errors
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
          throw new Error("XML parsing error: " + parserError.textContent);
        }

        // Extract document content
        const documentStructure = processOOXML(xmlDoc);
        resolve(documentStructure);
      } catch (error) {
        console.error("Error parsing XML:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsText(file);
  });
};

// Process Office Open XML (OOXML) document
function processOOXML(xmlDoc: Document): DocumentNode[] {
  const result: DocumentNode[] = [];

  // Look for the document body in OOXML
  const body = xmlDoc.querySelector("w\\:body, body");

  if (!body) {
    console.warn("Document body not found in XML");
    return result;
  }

  // Extract paragraphs
  const paragraphs = body.querySelectorAll("w\\:p, p");

  // Track heading levels for numbering
  let currentHeadingLevel = 0;
  const numberingCounters: number[] = Array(10).fill(0); // Support up to 10 levels

  // Process each paragraph
  paragraphs.forEach((paragraph, index) => {
    // Extract text content
    const textRuns = paragraph.querySelectorAll("w\\:t, t");
    let paragraphText = "";

    textRuns.forEach((textRun) => {
      paragraphText += textRun.textContent || "";
    });

    if (!paragraphText.trim()) {
      return; // Skip empty paragraphs
    }

    // Determine paragraph type and level
    let nodeType: DocumentNode["type"] = "paragraph";
    let level = 0;
    let numbering = "";

    // Check for heading style
    const styleElem = paragraph.querySelector("w\\:pStyle, pStyle");
    const styleName = styleElem?.getAttribute("w:val") || "";

    if (styleName.startsWith("Heading")) {
      nodeType = "heading";
      level = parseInt(styleName.replace("Heading", "")) || 1;
      currentHeadingLevel = level;

      // Reset numbering for current level and below
      for (let i = level; i < numberingCounters.length; i++) {
        numberingCounters[i] = 0;
      }

      // Increment current level counter
      numberingCounters[level - 1]++;

      // Generate heading number
      numbering = numberingCounters
        .slice(0, level)
        .filter((count) => count > 0)
        .join(".");
    }

    // Check for list items
    const numPr = paragraph.querySelector("w\\:numPr, numPr");
    if (numPr) {
      nodeType = "list-item";
      const ilvl = numPr.querySelector("w\\:ilvl, ilvl");
      level = parseInt(ilvl?.getAttribute("w:val") || "0") + 1;

      // Simple bullet or number based on level
      numbering = "•".repeat(level);
    }

    // Create document node
    const node: DocumentNode = {
      id: `node-${index}`,
      type: nodeType,
      level: level,
      content: paragraphText.trim(),
      children: [],
      numbering: numbering,
    };

    result.push(node);
  });

  return result;
}

// Additional helper function to organize nodes into a hierarchical structure
export const organizeHierarchy = (nodes: DocumentNode[]): DocumentNode[] => {
  const root: DocumentNode[] = [];
  const stack: DocumentNode[] = [];

  nodes.forEach((node) => {
    // If it's a top-level node or the stack is empty
    if (node.level === 0 || stack.length === 0) {
      root.push(node);
      stack.length = 0;
      stack.push(node);
      return;
    }

    // Find the appropriate parent
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node);
    } else {
      root.push(node);
    }

    stack.push(node);
  });

  return root;
};
