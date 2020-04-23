interface IBundle {
  id: string;
  name: string;
  file: string;
  publicPath: string;
}

export function sortScripts(fileNames: string[]): string[] {
  const vendorOrSharedRegex = /^vendor|shared/i;
  const appRegex = /^app\.[0-9a-z]+\.js$/i;

  const sortedNames = [...fileNames];
  let swapped = false;

  do {
    swapped = false;

    for (let i = 0; i < sortedNames.length; i++) {
      const a = sortedNames[i];
      const b = sortedNames[i + 1];

      if (
        !appRegex.test(a) &&
        !vendorOrSharedRegex.test(a) &&
        (vendorOrSharedRegex.test(b) || appRegex.test(b))
      ) {
        sortedNames[i] = b;
        sortedNames[i + 1] = a;
        swapped = true;
      }

      if (appRegex.test(a) && vendorOrSharedRegex.test(b)) {
        sortedNames[i] = b;
        sortedNames[i + 1] = a;
        swapped = true;
      }
    }
  } while (swapped);
  return sortedNames;
}

export function getAppFileAndMainVendorFileNames(files: string[]): string[] {
  return files.filter(f => {
    return (
      /^app\.[0-9a-z]+\.js$/i.test(f) || /^vendor\.[0-9a-z]+\.js$/i.test(f)
    );
  });
}

export function getSharedAndVendorBundles(
  files: string[],
  bundles: string[]
): string[] {
  return files.filter(file => {
    let check = false;
    for (const bundle of bundles) {
      if (file.includes(bundle)) {
        check = true;
        break;
      }
    }
    return check;
  });
}

export function getBundleNames(bundles: Array<IBundle | null>): string[] {
  return bundles
    .filter(b => b)
    .map(b => {
      const name = /^[a-z_]+/i.exec(b.file);
      return name ? name[0] : null;
    })
    .filter(b => b);
}

export function dedupeArray(arrayToDedupe: string[]): string[] {
  return [...new Set(arrayToDedupe)];
}
