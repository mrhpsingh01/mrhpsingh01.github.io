import fs from "fs";
import path from "path";

const docsDir = path.join(process.cwd(), "docs");
const folders = fs.readdirSync(docsDir).filter(f => fs.statSync(path.join(docsDir, f)).isDirectory());

const slugMap = {
  mmsar: "homesense-platform",
  cityops: "cityops",
  dawgsss: "ringside",
  f1_race_intel: "f1-race-intelligence",
  launchhelp: "launchhelp",
  mlfailurelab: "ml-failure-lab",
  mlforge: "mlforge",
  mydocker: "mydocker",
  query_doctor: "querydoctor",
  systemcraft: "systemforge",
  ufc_fight_intel: "ufc-fight-intel",
};

const result = {};

for (const folder of folders) {
  const folderPath = path.join(docsDir, folder);
  const files = fs.readdirSync(folderPath);
  const pngFiles = files.filter(f => f.endsWith(".png")).sort((a, b) => {
    const numA = parseInt(a.match(/^\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.match(/^\d+/)?.[0] || "0", 10);
    if (numA !== numB) return numA - numB;
    return a.localeCompare(b);
  });

  const readmePath = path.join(folderPath, "README.txt");
  let readmeContent = "";
  if (fs.existsSync(readmePath)) {
    readmeContent = fs.readFileSync(readmePath, "utf-8");
  }

  // Extract sections
  const lines = readmeContent.split(/\r?\n/);
  let title = "";
  let type = "";
  let stack = "";
  let runsOn = "";
  let whatItIs = "";
  let notes = "";
  let howToRun = "";
  const flowCaptions = {};

  // Find header before first section
  let firstHeaderIndex = lines.findIndex((l, i) => i > 0 && /^[=-]{3,}/.test(lines[i + 1] || ""));
  if (firstHeaderIndex > 0) {
    title = lines[0].replace(/[=\-_]/g, "").trim();
  } else {
    title = lines[0] || folder;
  }

  // Parse key-value in header area
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (i > 1 && /^[=-]{3,}/.test(lines[i + 1] || "")) {
      // Reached a major section like WHAT IT IS
      break;
    }
    if (/^Type:\s*/i.test(l)) {
      type = l.replace(/^Type:\s*/i, "").trim();
      let j = i + 1;
      while (j < lines.length && /^\s{4,}/.test(lines[j])) {
        type += " " + lines[j].trim();
        j++;
      }
    }
    if (/^Stack:\s*/i.test(l)) {
      stack = l.replace(/^Stack:\s*/i, "").trim();
      let j = i + 1;
      while (j < lines.length && /^\s{4,}/.test(lines[j])) {
        stack += " " + lines[j].trim();
        j++;
      }
    }
    if (/^Runs on:\s*/i.test(l)) {
      runsOn = l.replace(/^Runs on:\s*/i, "").trim();
      let j = i + 1;
      while (j < lines.length && /^\s{4,}/.test(lines[j])) {
        runsOn += " " + lines[j].trim();
        j++;
      }
    }
  }

  // Extract sections: WHAT IT IS, FLOWS / PAGES AND FLOWS / SCREENSHOTS, NOTES, HOW TO RUN
  const sections = {};
  let currentSecName = "";
  let currentSecLines = [];

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const next = lines[i + 1] || "";
    if (next.startsWith("---") || (i > 1 && next.startsWith("==="))) {
      if (currentSecName) {
        sections[currentSecName] = currentSecLines.join("\n").trim();
      }
      if (i > 0 && lines[i - 1] && /^(SCREENSHOTS|FLOWS|PAGES)/i.test(lines[i - 1])) {
        currentSecName = lines[i - 1].trim() + " " + l.trim();
        currentSecLines.pop();
      } else {
        currentSecName = l.trim();
      }
      currentSecLines = [];
      i++; // skip separator
    } else {
      currentSecLines.push(l);
    }
  }
  if (currentSecName) {
    sections[currentSecName] = currentSecLines.join("\n").trim();
  }

  whatItIs = sections["WHAT IT IS"] || "";
  const notesKey = Object.keys(sections).find(k => k.includes("NOTE") || k.includes("OTHER"));
  notes = notesKey ? sections[notesKey] : "";
  howToRun = sections["HOW TO RUN"] || "";

  // Parse flow captions
  const flowsSecKey = Object.keys(sections).find(k => k.includes("FLOW") || k.includes("SCREENSHOT"));
  const flowsText = flowsSecKey ? sections[flowsSecKey] : "";
  const flowLines = flowsText.split(/\r?\n/);
  let pendingFiles = [];
  let pendingDesc = [];

  const flushPending = () => {
    if (pendingFiles.length && pendingDesc.length) {
      const fullDesc = pendingDesc.join(" ").replace(/\s+/g, " ").trim();
      for (const f of pendingFiles) {
        flowCaptions[f] = fullDesc;
      }
    }
    pendingFiles = [];
    pendingDesc = [];
  };

  for (const rawLine of flowLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if line contains .png
    // Could be "01-home.png   Entry page: ..."
    // or "08-lesson-neural-network.png"
    // or "10-predictions.png / 13-predictions-timeline.png"
    if (trimmed.includes(".png")) {
      // Find all .png filenames in this line
      const fileMatches = trimmed.match(/\b\d+[\w-]+\.png\b/g);
      if (fileMatches && fileMatches.length > 0) {
        // Is there text after the filenames?
        // Remove the matched filenames and slashes from the start
        let remainder = trimmed;
        for (const fm of fileMatches) {
          remainder = remainder.replace(fm, "");
        }
        remainder = remainder.replace(/^[\s/]+/, "").trim();

        if (remainder) {
          // If we had pending files without descriptions, or new line, flush
          flushPending();
          pendingFiles = [...fileMatches];
          pendingDesc = [remainder];
        } else {
          // It's a line with just filenames, e.g. "08-lesson-neural-network.png"
          flushPending();
          pendingFiles.push(...fileMatches);
        }
        continue;
      }
    }

    // It's a continuation line of the description
    if (pendingFiles.length > 0) {
      pendingDesc.push(trimmed);
    }
  }
  flushPending();

  const images = pngFiles.map((filename) => {
    let caption = flowCaptions[filename] || "";
    const cleanTitle = filename.replace(/^\d+-/, "").replace(/\.png$/, "").replace(/-/g, " ");
    const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
    if (!caption) {
      caption = formattedTitle;
    }
    return {
      src: `/docs/${folder}/${filename}`,
      filename,
      title: formattedTitle,
      caption,
    };
  });

  let finalImages = images;
  if (folder === "mmsar") {
    finalImages = images.filter(img => img.filename !== "01-home.png");
  }

  const slug = slugMap[folder] || folder;

  result[slug] = {
    slug,
    folder,
    title,
    type,
    stack,
    runsOn,
    whatItIs,
    notes,
    howToRun,
    rawReadme: readmeContent,
    images: finalImages,
  };
}

const outTs = `// Generated from docs/ folders
export interface ProjectDocImage {
  src: string;
  filename: string;
  title: string;
  caption: string;
}

export interface ProjectDoc {
  slug: string;
  folder: string;
  title: string;
  type: string;
  stack: string;
  runsOn: string;
  whatItIs: string;
  notes: string;
  howToRun: string;
  rawReadme: string;
  images: ProjectDocImage[];
}

export const projectDocs: Record<string, ProjectDoc> = ${JSON.stringify(result, null, 2)};

export function getProjectDoc(slug: string): ProjectDoc | undefined {
  return projectDocs[slug];
}
`;

fs.writeFileSync(path.join(process.cwd(), "config/project-docs-data.ts"), outTs);
console.log("Successfully extracted project docs for", Object.keys(result).length, "projects!");
