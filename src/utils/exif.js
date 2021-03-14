const camelcase = require('camelcase');
const util = require('util');
const path = require('path');

const exec = util.promisify(require('child_process').exec);

const attributes = [
  '-Software',
  '-Model',
  '-Make',
  '-LensModel',
  '-Lens',
  '-Aperture',
  '-ShutterSpeed',
  '-ExposureTime',
  '-ISO',
  '-ImageWidth',
  '-ImageHeight',
  '-MimeType',
  '-FocalLength',
  '-Megapixels',
  '-FileType',
  '-Compression',
].join(' ');

const keysToCamelcase = (data) =>
  Object.entries(data).reduce((a, cur) => {
    const [k, v] = cur;
    a[camelcase(k)] = v;
    return a;
  }, {});

const exif = async (image) => {
  const binaryPath = path.join(
    `"${process.cwd()}"`,
    '/thirdParty',
    '/exif',
    '/exiftool',
  );

  const imagePath = path.join(`"${process.cwd()}"`, `"${image}"`);

  try {
    const { stdout, stderr } = await exec(
      `${binaryPath} ${attributes} -json ${imagePath}`,
    );

    const data = keysToCamelcase(JSON.parse(stdout)[0]);

    if (stderr) {
      return { error: stdout };
    }

    return data;
  } catch (e) {
    console.error({ error: e.message });
  }
};

module.exports = exif;
