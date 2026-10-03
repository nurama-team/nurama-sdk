#!/usr/bin/env node

/**
 * Decide the next external release of @nurama/sdk (and @nurama/types, which is
 * released in lockstep under the same number).
 *
 * Run by `.github/workflows/release-sdk.yml` on every production deploy. Prints
 * `key=value` lines for $GITHUB_OUTPUT:
 *
 *   release=true|false   whether anything shippable changed since the last release
 *   version=<x.y.z>      the version to publish (or the current one when release=false)
 *   hash=<releaseHash>   recorded on the release tag
 *
 * Every release is an annotated git tag `sdk-v<version>` whose message carries
 * `release-hash: <hash>`. The next version is the latest tag's patch + 1 —
 * unless packages/sdk/package.json says something higher, which is how to cut
 * a minor or major release (set it to e.g. 1.5.0 or 2.0.0; optional, nothing
 * else ever needs editing). With no tags yet, the first release is
 * package.json's version.
 *
 * The tag is pushed only after every publish step succeeds, so a failed run
 * re-resolves the same version when retried.
 */

const { execSync } = require('child_process');
const path = require('path');
const { releaseHash, packageVersion } = require('./generate-version-info.cjs');

const TAG_PREFIX = 'sdk-v';
const ROOT_DIR = path.join(__dirname, '..');

const git = (args) => execSync(`git ${args}`, { cwd: ROOT_DIR, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

const parse = (version) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  return match ? match.slice(1).map(Number) : null;
};

const compare = (a, b) => {
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
};

const bumpPatch = (version) => {
  const [major, minor, patch] = parse(version);
  return `${major}.${minor}.${patch + 1}`;
};

function latestRelease() {
  const versions = git(`tag --list '${TAG_PREFIX}*'`)
    .split('\n')
    .map((tag) => tag.slice(TAG_PREFIX.length))
    .filter(parse)
    .sort(compare);
  const version = versions[versions.length - 1];
  if (!version) return null;
  const message = git(`tag --list --format='%(contents)' '${TAG_PREFIX}${version}'`);
  const hash = /release-hash:\s*([0-9a-f]+)/.exec(message)?.[1] ?? null;
  return { version, hash };
}

function main() {
  const hash = releaseHash();
  const base = packageVersion();
  if (!parse(base)) throw new Error(`packages/sdk/package.json version "${base}" is not x.y.z`);

  const latest = latestRelease();
  let release = true;
  let version = base;

  if (latest) {
    if (latest.hash === hash) {
      release = false;
      version = latest.version;
    } else {
      const next = bumpPatch(latest.version);
      version = compare(base, next) > 0 ? base : next;
    }
  }

  process.stdout.write(`release=${release}\nversion=${version}\nhash=${hash}\n`);
}

main();
