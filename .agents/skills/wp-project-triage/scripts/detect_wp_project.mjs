import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const TOOL_VERSION = "0.2.0";

const DEFAULT_IGNORES = new Set([
  ".git",
  "node_modules",
  "vendor",
  "dist",
  "build",
  "coverage",
  ".next",
  ".turbo",
]);

function statSafe(p) {
  try {
    return fs.statSync(p);
  } catch {
    return null;
  }
}

function existsFile(p) {
  const st = statSafe(p);
  return Boolean(st && st.isFile());
}

function existsDir(p) {
  const st = statSafe(p);
  return Boolean(st && st.isDirectory());
}

function readFileSafe(p, maxBytes = 256 * 1024) {
  try {
    const buf = fs.readFileSync(p);
    if (buf.byteLength > maxBytes) return buf.subarray(0, maxBytes).toString("utf8");
    return buf.toString("utf8");
  } catch {
    return null;
  }
}

function dedupe(items) {
  return [...new Set(items)];
}

function toRelative(repoRoot, absolutePath) {
  return path.relative(repoRoot, absolutePath) || ".";
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function parseJsonFile(filePath) {
  const txt = readFileSafe(filePath);
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

function detectPackageManager(dirPath) {
  const hasPnpm = existsFile(path.join(dirPath, "pnpm-lock.yaml"));
  const hasYarn = existsFile(path.join(dirPath, "yarn.lock"));
  const hasNpm = existsFile(path.join(dirPath, "package-lock.json"));
  const hasBun = existsFile(path.join(dirPath, "bun.lockb")) || existsFile(path.join(dirPath, "bun.lock"));
  if (hasPnpm) return "pnpm";
  if (hasYarn) return "yarn";
  if (hasBun) return "bun";
  if (hasNpm) return "npm";
  return null;
}

function findFilesRecursive(repoRoot, predicate, { maxFiles = 6000, maxDepth = 8 } = {}) {
  const results = [];
  const queue = [{ dir: repoRoot, depth: 0 }];
  let visited = 0;

  while (queue.length > 0) {
    const { dir, depth } = queue.shift();
    if (depth > maxDepth) continue;

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (DEFAULT_IGNORES.has(ent.name)) continue;
        queue.push({ dir: fullPath, depth: depth + 1 });
        continue;
      }
      if (!ent.isFile()) continue;

      visited += 1;
      if (visited > maxFiles) return { results, truncated: true };
      if (predicate(fullPath)) results.push(fullPath);
    }
  }

  return { results, truncated: false };
}

function scanForTokens(repoRoot, { tokens, exts, maxFiles = 2500, maxDepth = 8 }) {
  const loweredTokens = tokens.map((t) => t.toLowerCase());
  const matches = new Map();
  const { results: files, truncated } = findFilesRecursive(
    repoRoot,
    (p) => exts.includes(path.extname(p).toLowerCase()),
    { maxFiles, maxDepth }
  );

  for (const filePath of files) {
    const contents = readFileSafe(filePath, 128 * 1024);
    if (!contents) continue;
    const haystack = contents.toLowerCase();

    for (const token of loweredTokens) {
      if (matches.has(token)) continue;
      if (haystack.includes(token)) matches.set(token, path.relative(repoRoot, filePath));
    }
    if (matches.size === loweredTokens.length) break;
  }

  return { truncated, matches: Object.fromEntries([...matches.entries()]) };
}

function detectPluginHeaderFromPhpFile(filePath) {
  const contents = readFileSafe(filePath, 128 * 1024);
  if (!contents) return null;
  const headerMatch = contents.match(/^\s*Plugin Name:\s*(.+)\s*$/im);
  if (!headerMatch) return null;
  return headerMatch[1].trim();
}

function detectThemeHeaderFromStyleCss(filePath) {
  const contents = readFileSafe(filePath, 128 * 1024);
  if (!contents) return null;
  const headerMatch = contents.match(/^\s*Theme Name:\s*(.+)\s*$/im);
  if (!headerMatch) return null;
  return headerMatch[1].trim();
}

function guessWpCoreVersionFromCheckout(repoRoot) {
  const versionPhp = path.join(repoRoot, "wp-includes", "version.php");
  if (!existsFile(versionPhp)) return { value: null, source: null };
  const contents = readFileSafe(versionPhp, 64 * 1024);
  if (!contents) return { value: null, source: null };
  const match = contents.match(/\$wp_version\s*=\s*'([^']+)'/);
  if (!match) return { value: null, source: "wp-includes/version.php" };
  return { value: match[1], source: "wp-includes/version.php" };
}

function guessGutenbergVersion(repoRoot) {
  const candidates = [
    path.join(repoRoot, "packages", "plugins", "package.json"),
    path.join(repoRoot, "package.json"),
  ];

  for (const candidate of candidates) {
    if (!existsFile(candidate)) continue;
    const pkg = parseJsonFile(candidate);
    if (!pkg) continue;
    if ((pkg?.name === "@wordpress/plugins" || pkg?.name === "gutenberg") && typeof pkg?.version === "string") {
      return { value: pkg.version, source: path.relative(repoRoot, candidate) };
    }
  }
  return { value: null, source: null };
}

function detectConfigConstants(siteRoot, repoRoot) {
  const configPath = path.join(siteRoot, "wp-config.php");
  if (!existsFile(configPath)) {
    return { source: null, constants: {} };
  }

  const contents = readFileSafe(configPath, 256 * 1024);
  if (!contents) return { source: path.relative(repoRoot, configPath), constants: {} };

  const enabled = (name) =>
    new RegExp(`define\\(\\s*['\"]${name}['\"]\\s*,\\s*(true|1)\\s*\\)`, "i").test(contents) ||
    new RegExp(`\\b${name}\\b\\s*=\\s*(true|1)`, "i").test(contents);
  const mentioned = (name) => new RegExp(`\\b${name}\\b`, "i").test(contents);

  return {
    source: path.relative(repoRoot, configPath),
    constants: {
      savequeriesMentioned: mentioned("SAVEQUERIES"),
      savequeriesEnabled: enabled("SAVEQUERIES"),
      wpDebugMentioned: mentioned("WP_DEBUG"),
      wpDebugEnabled: enabled("WP_DEBUG"),
      disableWpCronMentioned: mentioned("DISABLE_WP_CRON"),
      disableWpCronEnabled: enabled("DISABLE_WP_CRON"),
    },
  };
}

function detectWordpressSiteRoot(repoRoot) {
  const commonNames = ["wordpress", "web", "public", "docroot", "site"];
  const candidates = [];

  const pushCandidate = (dirPath, source) => {
    if (!existsDir(dirPath)) return;
    const hasWpContent = existsDir(path.join(dirPath, "wp-content"));
    const hasCoreVersion = existsFile(path.join(dirPath, "wp-includes", "version.php"));
    const hasWpConfig = existsFile(path.join(dirPath, "wp-config.php"));
    if (!hasWpContent && !hasCoreVersion && !hasWpConfig) return;
    candidates.push({ dirPath, source, hasWpContent, hasCoreVersion, hasWpConfig });
  };

  pushCandidate(repoRoot, "repo-root");
  for (const name of commonNames) pushCandidate(path.join(repoRoot, name), `common-subdir:${name}`);

  const { results: wpConfigFiles } = findFilesRecursive(repoRoot, (p) => path.basename(p) === "wp-config.php", {
    maxFiles: 2000,
    maxDepth: 3,
  });
  for (const configFile of wpConfigFiles) pushCandidate(path.dirname(configFile), `wp-config-scan:${path.relative(repoRoot, configFile)}`);

  const unique = dedupe(candidates.map((candidate) => candidate.dirPath)).map((dirPath) =>
    candidates.find((candidate) => candidate.dirPath === dirPath)
  );

  if (unique.length === 0) {
    return { siteRoot: repoRoot, siteRootRelative: ".", candidates: [], nestedInstall: false };
  }

  const score = (candidate) => {
    let value = 0;
    if (candidate.dirPath === repoRoot) value += 100;
    if (candidate.hasWpContent) value += 30;
    if (candidate.hasCoreVersion) value += 20;
    if (candidate.hasWpConfig) value += 10;
    const basename = path.basename(candidate.dirPath);
    const commonIndex = commonNames.indexOf(basename);
    if (commonIndex !== -1) value += 10 - commonIndex;
    return value;
  };

  unique.sort((a, b) => score(b) - score(a));
  const best = unique[0];

  return {
    siteRoot: best.dirPath,
    siteRootRelative: toRelative(repoRoot, best.dirPath),
    candidates: unique.map((candidate) => ({
      path: toRelative(repoRoot, candidate.dirPath),
      source: candidate.source,
      hasWpContent: candidate.hasWpContent,
      hasCoreVersion: candidate.hasCoreVersion,
      hasWpConfig: candidate.hasWpConfig,
    })),
    nestedInstall: best.dirPath !== repoRoot,
  };
}

function listImmediateChildDirs(dirPath) {
  if (!existsDir(dirPath)) return [];
  try {
    return fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(dirPath, entry.name));
  } catch {
    return [];
  }
}

function collectCandidateProjectRoots(repoRoot, siteRoot) {
  const roots = [repoRoot];
  if (siteRoot !== repoRoot) roots.push(siteRoot);

  const wpContentRoot = path.join(siteRoot, "wp-content");
  roots.push(...listImmediateChildDirs(path.join(wpContentRoot, "plugins")));
  roots.push(...listImmediateChildDirs(path.join(wpContentRoot, "themes")));
  roots.push(...listImmediateChildDirs(path.join(wpContentRoot, "mu-plugins")));
  if (existsDir(path.join(wpContentRoot, "mu-plugins"))) roots.push(path.join(wpContentRoot, "mu-plugins"));

  return dedupe(roots.filter((candidate) => existsDir(candidate)));
}

function findRootPhpFiles(rootDir) {
  if (!existsDir(rootDir)) return [];
  try {
    return fs
      .readdirSync(rootDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".php"))
      .map((entry) => path.join(rootDir, entry.name));
  } catch {
    return [];
  }
}

function findProjectToolFiles(repoRoot, candidateRoots) {
  const result = {
    composerJsonFiles: [],
    phpstanConfigFiles: [],
    phpcsConfigFiles: [],
    phpunitXmlFiles: [],
    packageJsonFiles: [],
    wpEnvFiles: [],
    playwrightConfigFiles: [],
  };

  const pushIfFile = (bucket, filePath) => {
    if (existsFile(filePath)) bucket.push(toRelative(repoRoot, filePath));
  };

  for (const rootDir of candidateRoots) {
    pushIfFile(result.composerJsonFiles, path.join(rootDir, "composer.json"));
    pushIfFile(result.phpstanConfigFiles, path.join(rootDir, "phpstan.neon"));
    pushIfFile(result.phpstanConfigFiles, path.join(rootDir, "phpstan.neon.dist"));
    pushIfFile(result.phpcsConfigFiles, path.join(rootDir, "phpcs.xml"));
    pushIfFile(result.phpcsConfigFiles, path.join(rootDir, "phpcs.xml.dist"));
    pushIfFile(result.phpunitXmlFiles, path.join(rootDir, "phpunit.xml"));
    pushIfFile(result.phpunitXmlFiles, path.join(rootDir, "phpunit.xml.dist"));
    pushIfFile(result.packageJsonFiles, path.join(rootDir, "package.json"));
    pushIfFile(result.wpEnvFiles, path.join(rootDir, ".wp-env.json"));
    pushIfFile(result.wpEnvFiles, path.join(rootDir, ".wp-env.override.json"));
    for (const filename of ["playwright.config.js", "playwright.config.ts", "playwright.config.mjs", "playwright.config.cjs"]) {
      pushIfFile(result.playwrightConfigFiles, path.join(rootDir, filename));
    }
  }

  for (const key of Object.keys(result)) result[key] = dedupe(result[key]);
  return result;
}

function detectLocalPlugin(candidateRoots, repoRoot) {
  for (const rootDir of candidateRoots) {
    for (const phpFile of findRootPhpFiles(rootDir)) {
      const pluginName = detectPluginHeaderFromPhpFile(phpFile);
      if (pluginName) return { name: pluginName, source: toRelative(repoRoot, phpFile) };
    }
  }
  return { name: null, source: null };
}

function detectLocalTheme(candidateRoots, repoRoot) {
  for (const rootDir of candidateRoots) {
    const styleCss = path.join(rootDir, "style.css");
    const themeName = detectThemeHeaderFromStyleCss(styleCss);
    if (themeName) return { name: themeName, source: toRelative(repoRoot, styleCss) };
  }
  return { name: null, source: null };
}

function hasTemplatesSignals(rootDir) {
  return ["templates", "parts", "patterns"].some((dirname) => existsDir(path.join(rootDir, dirname)));
}

function detectBlockThemeRoots(repoRoot, candidateRoots) {
  const roots = [];
  for (const rootDir of candidateRoots) {
    if (existsFile(path.join(rootDir, "theme.json")) && hasTemplatesSignals(rootDir)) {
      roots.push(toRelative(repoRoot, rootDir));
    }
  }
  return dedupe(roots);
}

function filterUserBlockJsonFiles(repoRoot, blockJsonFiles, siteRoot) {
  const siteWpIncludes = path.join(siteRoot, "wp-includes");
  const siteWpAdmin = path.join(siteRoot, "wp-admin");
  return blockJsonFiles.filter((filePath) => !filePath.startsWith(siteWpIncludes) && !filePath.startsWith(siteWpAdmin));
}

function detectKinds(signals) {
  const kinds = new Set();

  if (signals.isGutenbergRepo) kinds.add("gutenberg");
  if (signals.isWpCoreCheckout) kinds.add("wp-core");
  if (signals.nestedInstall) kinds.add("site-stack");
  if (signals.hasWpContentDir) kinds.add("wp-site");
  if (signals.detectedThemeName) kinds.add(signals.isBlockTheme ? "wp-block-theme" : "wp-theme");
  if (signals.detectedPluginName) kinds.add(signals.isBlockPlugin ? "wp-block-plugin" : "wp-plugin");
  if (signals.hasMuPluginsDir) kinds.add("wp-mu-plugin");

  if (kinds.size === 0) kinds.add("unknown");

  const priority = [
    "gutenberg",
    "wp-core",
    "site-stack",
    "wp-site",
    "wp-block-theme",
    "wp-block-plugin",
    "wp-theme",
    "wp-mu-plugin",
    "wp-plugin",
    "unknown",
  ];

  let primary = "unknown";
  for (const kind of priority) {
    if (kinds.has(kind)) {
      primary = kind;
      break;
    }
  }

  return { kind: [...kinds], primary };
}

function buildRecommendations({ repoRoot, primaryKind, packageManager, packageJson, tooling, signals }) {
  const commands = [];
  const notes = [];

  if (tooling.node.hasPackageJson && packageJson) {
    const pm = packageManager ?? "npm";
    const run = pm === "yarn" ? "yarn" : `${pm} run`;
    const scripts = packageJson?.scripts || {};
    if (Object.prototype.hasOwnProperty.call(scripts, "lint")) commands.push(`${run} lint`);
    if (Object.prototype.hasOwnProperty.call(scripts, "test")) commands.push(`${run} test`);
    if (Object.prototype.hasOwnProperty.call(scripts, "build")) commands.push(`${run} build`);
    if (Object.prototype.hasOwnProperty.call(scripts, "start")) commands.push(`${run} start`);
    if (tooling.node.usesWordpressScripts) notes.push("Detected @wordpress/scripts usage; prefer its standard lint/build/test scripts.");
  }

  for (const relPath of tooling.php.composerJsonFiles || []) {
    const workdir = path.dirname(relPath);
    const prefix = workdir === "." ? "" : `cd ${shellQuote(workdir)} && `;
    commands.push(`${prefix}composer install`);
    if (tooling.php.phpstanConfigFiles.some((filePath) => path.dirname(filePath) === workdir)) commands.push(`${prefix}composer phpstan`);
    if (tooling.php.phpcsConfigFiles.some((filePath) => path.dirname(filePath) === workdir)) commands.push(`${prefix}composer phpcs`);
    if (tooling.php.phpunitXml.some((filePath) => path.dirname(filePath) === workdir)) commands.push(`${prefix}vendor/bin/phpunit`);
  }

  for (const relPath of tooling.node.packageJsonFiles || []) {
    const workdir = path.dirname(relPath);
    const prefix = workdir === "." ? "" : `cd ${shellQuote(workdir)} && `;
    const pkg = parseJsonFile(path.join(repoRoot, relPath));
    const scripts = pkg?.scripts || {};
    const pmForDir = detectPackageManager(path.dirname(path.join(repoRoot, relPath))) ?? "npm";
    const run = pmForDir === "yarn" ? "yarn" : `${pmForDir} run`;
    if (Object.prototype.hasOwnProperty.call(scripts, "lint")) commands.push(`${prefix}${run} lint`);
    if (Object.prototype.hasOwnProperty.call(scripts, "test")) commands.push(`${prefix}${run} test`);
    if (Object.prototype.hasOwnProperty.call(scripts, "build")) commands.push(`${prefix}${run} build`);
  }

  if (tooling.tests.hasWpEnv) notes.push("Detected wp-env; E2E workflows may rely on Docker.");
  if (signals.scanTruncated) notes.push("Scan truncated due to file limit; some signals may be missing.");
  if (primaryKind === "unknown") notes.push("Could not confidently classify repo; inspect root for plugin/theme headers or wp-content structure.");
  if (signals.nestedInstall) notes.push(`Detected WordPress in subdirectory ${signals.paths.siteRoot}; scope work to the selected plugin/theme target before editing.`);

  return { commands: dedupe(commands), notes: dedupe(notes) };
}

function main() {
  const repoRoot = process.cwd();
  const siteDetection = detectWordpressSiteRoot(repoRoot);
  const siteRoot = siteDetection.siteRoot;

  const wpContent = path.join(siteRoot, "wp-content");
  const pluginsDir = path.join(wpContent, "plugins");
  const muPluginsDir = path.join(wpContent, "mu-plugins");
  const themesDir = path.join(wpContent, "themes");
  const candidateRoots = collectCandidateProjectRoots(repoRoot, siteRoot);

  const isWpCoreCheckout = existsFile(path.join(repoRoot, "wp-includes", "version.php"));
  const isGutenbergRepo =
    existsDir(path.join(repoRoot, "packages")) &&
    (existsDir(path.join(repoRoot, "packages", "block-editor")) || existsDir(path.join(repoRoot, "packages", "components")));

  const toolFiles = findProjectToolFiles(repoRoot, candidateRoots);
  const preferredPackageJsonPath = toolFiles.packageJsonFiles[0] ? path.join(repoRoot, toolFiles.packageJsonFiles[0]) : null;
  const preferredComposerJsonPath = toolFiles.composerJsonFiles[0] ? path.join(repoRoot, toolFiles.composerJsonFiles[0]) : null;
  const packageJson = preferredPackageJsonPath ? parseJsonFile(preferredPackageJsonPath) : null;
  const composerJson = preferredComposerJsonPath ? parseJsonFile(preferredComposerJsonPath) : null;
  const packageManager = preferredPackageJsonPath ? detectPackageManager(path.dirname(preferredPackageJsonPath)) : detectPackageManager(repoRoot);

  const usesWordpressScripts = Boolean(
    packageJson?.devDependencies?.["@wordpress/scripts"] ||
      packageJson?.dependencies?.["@wordpress/scripts"] ||
      packageJson?.scripts?.build?.includes("wp-scripts") ||
      packageJson?.scripts?.start?.includes("wp-scripts") ||
      packageJson?.scripts?.test?.includes("wp-scripts") ||
      packageJson?.scripts?.lint?.includes("wp-scripts")
  );

  const pkgHasInteractivity = Boolean(
    packageJson?.devDependencies?.["@wordpress/interactivity"] || packageJson?.dependencies?.["@wordpress/interactivity"]
  );
  const pkgHasAbilities = Boolean(
    packageJson?.devDependencies?.["@wordpress/abilities"] || packageJson?.dependencies?.["@wordpress/abilities"]
  );

  const hasWpContentDir = existsDir(wpContent);
  const hasPluginsDir = existsDir(pluginsDir);
  const hasThemesDir = existsDir(themesDir);
  const hasMuPluginsDir = existsDir(muPluginsDir);

  const config = detectConfigConstants(siteRoot, repoRoot);
  const pluginDetectionRoots = candidateRoots.filter((rootDir) => rootDir === repoRoot || rootDir.startsWith(pluginsDir) || rootDir.startsWith(muPluginsDir));
  const themeDetectionRoots = candidateRoots.filter((rootDir) => rootDir === repoRoot || rootDir.startsWith(themesDir));
  const pluginDetection = detectLocalPlugin(pluginDetectionRoots, repoRoot);
  const themeDetection = detectLocalTheme(themeDetectionRoots, repoRoot);

  const { results: blockJsonFiles, truncated: scanTruncated } = findFilesRecursive(repoRoot, (p) => path.basename(p) === "block.json", {
    maxFiles: 6000,
    maxDepth: 8,
  });
  const { results: themeJsonFiles } = findFilesRecursive(repoRoot, (p) => path.basename(p) === "theme.json", {
    maxFiles: 6000,
    maxDepth: 8,
  });

  const userBlockJsonFiles = filterUserBlockJsonFiles(repoRoot, blockJsonFiles, siteRoot);
  const blockThemeRoots = detectBlockThemeRoots(repoRoot, themeDetectionRoots);
  const isBlockTheme = blockThemeRoots.length > 0;
  const pluginsRel = toRelative(repoRoot, pluginsDir).replace(/\\/g, "/");
  const muPluginsRel = toRelative(repoRoot, muPluginsDir).replace(/\\/g, "/");
  const isBlockPlugin = userBlockJsonFiles.some((filePath) => {
    const rel = toRelative(repoRoot, filePath).replace(/\\/g, "/");
    return rel.startsWith(`${pluginsRel}/`) || rel.startsWith(`${muPluginsRel}/`) || (!rel.startsWith("wordpress/wp-includes/") && !rel.startsWith("wordpress/wp-admin/"));
  });

  const interactivityScan = scanForTokens(repoRoot, {
    tokens: ["data-wp-interactive", "@wordpress/interactivity", "viewScriptModule"],
    exts: [".php", ".js", ".ts", ".tsx", ".json", ".html"],
    maxFiles: 2500,
    maxDepth: 8,
  });
  const abilitiesScan = scanForTokens(repoRoot, {
    tokens: [
      "wp_register_ability(",
      "wp_register_ability_category(",
      "wp_abilities_api_init",
      "wp_abilities_api_categories_init",
      "wp-abilities/v1",
      "@wordpress/abilities",
    ],
    exts: [".php", ".js", ".ts", ".tsx"],
    maxFiles: 2500,
    maxDepth: 8,
  });
  const innerBlocksScan = scanForTokens(repoRoot, {
    tokens: ["InnerBlocks", "useInnerBlocksProps", "InnerBlocks.Content"],
    exts: [".js", ".ts", ".tsx"],
    maxFiles: 2500,
    maxDepth: 8,
  });

  const wpCliConfigBasenames = new Set(["wp-cli.yml", "wp-cli.yaml", "wp-cli.local.yml", "wp-cli.local.yaml", ".wp-cli.yml", ".wp-cli.yaml"]);
  const { results: wpCliConfigFiles, truncated: wpCliConfigTruncated } = findFilesRecursive(repoRoot, (p) => wpCliConfigBasenames.has(path.basename(p)), {
    maxFiles: 6000,
    maxDepth: 6,
  });

  const composerRequire = composerJson?.require && typeof composerJson.require === "object" ? composerJson.require : {};
  const composerRequireDev = composerJson?.["require-dev"] && typeof composerJson["require-dev"] === "object" ? composerJson["require-dev"] : {};
  const composerHasWpCli = Boolean(
    composerRequire["wp-cli/wp-cli"] ||
      composerRequireDev["wp-cli/wp-cli"] ||
      composerRequire["wp-cli/wp-cli-bundle"] ||
      composerRequireDev["wp-cli/wp-cli-bundle"]
  );
  const wpCliTokenScan = scanForTokens(repoRoot, {
    tokens: [
      "wp search-replace",
      "wp db export",
      "wp db import",
      "wp cron event",
      "wp cache flush",
      "wp rewrite flush",
      "wp plugin update",
      "wp theme update",
    ],
    exts: [".sh", ".yml", ".yaml", ".js", ".ts", ".php", ".json"],
    maxFiles: 2500,
    maxDepth: 8,
  });

  const usesInteractivityApi = pkgHasInteractivity || Object.keys(interactivityScan.matches).length > 0;
  const usesAbilitiesApi = pkgHasAbilities || Object.keys(abilitiesScan.matches).length > 0;
  const usesInnerBlocks = Object.keys(innerBlocksScan.matches).length > 0;
  const usesWpCli = composerHasWpCli || wpCliConfigFiles.length > 0 || Object.keys(wpCliTokenScan.matches).length > 0;

  const hasObjectCacheDropin = existsFile(path.join(wpContent, "object-cache.php"));
  const hasAdvancedCacheDropin = existsFile(path.join(wpContent, "advanced-cache.php"));
  const hasDbDropin = existsFile(path.join(wpContent, "db.php"));
  const hasSunriseDropin = existsFile(path.join(wpContent, "sunrise.php"));
  const hasQueryMonitorPlugin = existsDir(path.join(wpContent, "plugins", "query-monitor"));
  const hasPerformanceLabPlugin = existsDir(path.join(wpContent, "plugins", "performance-lab"));

  const packageJsonObjects = toolFiles.packageJsonFiles
    .map((relativePath) => ({ relativePath, pkg: parseJsonFile(path.join(repoRoot, relativePath)) }))
    .filter((entry) => entry.pkg);
  const composerJsonObjects = toolFiles.composerJsonFiles
    .map((relativePath) => ({ relativePath, pkg: parseJsonFile(path.join(repoRoot, relativePath)) }))
    .filter((entry) => entry.pkg);

  const hasWpEnv =
    toolFiles.wpEnvFiles.length > 0 ||
    packageJsonObjects.some(({ pkg }) => Boolean(pkg?.devDependencies?.["@wordpress/env"] || pkg?.dependencies?.["@wordpress/env"]));
  const hasPlaywright =
    toolFiles.playwrightConfigFiles.length > 0 ||
    packageJsonObjects.some(
      ({ pkg }) =>
        Boolean(
          pkg?.devDependencies?.["@playwright/test"] ||
            pkg?.dependencies?.["@playwright/test"] ||
            pkg?.devDependencies?.["@wordpress/e2e-test-utils-playwright"] ||
            pkg?.dependencies?.["@wordpress/e2e-test-utils-playwright"]
        )
    );
  const hasJest = packageJsonObjects.some(
    ({ pkg }) =>
      Boolean(
        pkg?.devDependencies?.jest ||
          pkg?.dependencies?.jest ||
          pkg?.devDependencies?.["@wordpress/jest-preset-default"] ||
          pkg?.dependencies?.["@wordpress/jest-preset-default"]
      )
  );
  const hasPhpUnit =
    toolFiles.phpunitXmlFiles.length > 0 ||
    composerJsonObjects.some(({ pkg }) => Boolean(pkg?.requireDev?.phpunit || pkg?.["require-dev"]?.phpunit));
  const hasPhpStan =
    toolFiles.phpstanConfigFiles.length > 0 ||
    composerJsonObjects.some(({ pkg }) => Boolean(pkg?.requireDev?.phpstan || pkg?.["require-dev"]?.phpstan || pkg?.["require-dev"]?.["phpstan/phpstan"]));
  const hasPhpcs =
    toolFiles.phpcsConfigFiles.length > 0 ||
    composerJsonObjects.some(
      ({ pkg }) =>
        Boolean(
          pkg?.requireDev?.php_codesniffer ||
            pkg?.["require-dev"]?.php_codesniffer ||
            pkg?.["require-dev"]?.["phpcsstandards/php_codesniffer"] ||
            pkg?.["require-dev"]?.["squizlabs/php_codesniffer"]
        )
    );

  const signals = {
    paths: {
      repoRoot,
      siteRoot: siteDetection.siteRootRelative,
      wpContent: hasWpContentDir ? wpContent : null,
      pluginsDir: hasPluginsDir ? pluginsDir : null,
      themesDir: hasThemesDir ? themesDir : null,
      muPluginsDir: hasMuPluginsDir ? muPluginsDir : null,
    },
    candidateProjectRoots: candidateRoots.map((rootDir) => toRelative(repoRoot, rootDir)),
    wordpressInstallations: siteDetection.candidates,
    nestedInstall: siteDetection.nestedInstall,
    isWpCoreCheckout,
    isGutenbergRepo,
    hasWpContentDir,
    hasPluginsDir,
    hasThemesDir,
    hasMuPluginsDir,
    detectedPluginName: pluginDetection.name,
    detectedPluginSource: pluginDetection.source,
    detectedThemeName: themeDetection.name,
    detectedThemeSource: themeDetection.source,
    isBlockPlugin,
    isBlockTheme,
    blockThemeRoots,
    usesInteractivityApi,
    usesAbilitiesApi,
    usesInnerBlocks,
    usesWpCli,
    performanceHints: {
      wpConfig: config.source,
      constants: config.constants,
      dropins: {
        objectCache: hasObjectCacheDropin,
        advancedCache: hasAdvancedCacheDropin,
        db: hasDbDropin,
        sunrise: hasSunriseDropin,
      },
      plugins: {
        queryMonitor: hasQueryMonitorPlugin,
        performanceLab: hasPerformanceLabPlugin,
      },
    },
    interactivityHints: {
      packageJson: pkgHasInteractivity,
      matches: interactivityScan.matches,
      scanTruncated: interactivityScan.truncated,
    },
    abilitiesHints: {
      packageJson: pkgHasAbilities,
      matches: abilitiesScan.matches,
      scanTruncated: abilitiesScan.truncated,
    },
    innerBlocksHints: {
      matches: innerBlocksScan.matches,
      scanTruncated: innerBlocksScan.truncated,
    },
    wpCliHints: {
      configFiles: wpCliConfigFiles.map((p) => path.relative(repoRoot, p)).slice(0, 50),
      configScanTruncated: wpCliConfigTruncated,
      composerJson: composerHasWpCli,
      matches: wpCliTokenScan.matches,
      scanTruncated: wpCliTokenScan.truncated,
    },
    blockJsonFiles: userBlockJsonFiles.map((p) => path.relative(repoRoot, p)).slice(0, 50),
    themeJsonFiles: themeJsonFiles.map((p) => path.relative(repoRoot, p)).slice(0, 50),
    scanTruncated,
  };

  const { kind, primary } = detectKinds(signals);
  const versions = {
    wordpress: {
      core: siteRoot === repoRoot ? guessWpCoreVersionFromCheckout(repoRoot) : guessWpCoreVersionFromCheckout(siteRoot),
    },
    gutenberg: guessGutenbergVersion(repoRoot),
  };

  const tooling = {
    php: {
      hasComposerJson: toolFiles.composerJsonFiles.length > 0,
      composerJsonFiles: toolFiles.composerJsonFiles,
      hasVendorDir: candidateRoots.some((rootDir) => existsDir(path.join(rootDir, "vendor"))),
      phpstanConfigFiles: toolFiles.phpstanConfigFiles,
      phpcsConfigFiles: toolFiles.phpcsConfigFiles,
      phpunitXml: toolFiles.phpunitXmlFiles,
      hasPhpStan,
      hasPhpcs,
    },
    node: {
      hasPackageJson: toolFiles.packageJsonFiles.length > 0,
      packageJsonFiles: toolFiles.packageJsonFiles,
      packageManager,
      usesWordpressScripts,
    },
    tests: {
      hasPhpUnit,
      hasWpEnv,
      wpEnvFiles: toolFiles.wpEnvFiles,
      hasPlaywright,
      playwrightConfigFiles: toolFiles.playwrightConfigFiles,
      hasJest,
    },
  };

  const recommendations = buildRecommendations({
    repoRoot,
    primaryKind: primary,
    packageManager,
    packageJson,
    tooling,
    signals,
  });

  const report = {
    tool: { name: "detect_wp_project", version: TOOL_VERSION },
    project: { kind, primary, notes: [] },
    signals,
    tooling,
    versions,
    recommendations,
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main();
