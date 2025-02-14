/**
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-Present, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */

const fs = require("fs-extra");
const path = require("path");
const fh = require("filehound");
const chokidar = require("chokidar");

/**
 * Creates an object readable by client
 * @param {Core} core MeeseOS Core instance reference
 * @param {String} realRoot
 * @param {String} file
 * @returns {Object}
 */
const createFileIter = (core, realRoot, file) => {
	const filename = path.basename(file);
	const realPath = path.join(realRoot, filename);
	const { mime } = core.make("meeseOS/vfs");

	const createStat = (stat) => ({
		isDirectory: stat.isDirectory(),
		isFile: stat.isFile(),
		mime: stat.isFile() ? mime(realPath) : null,
		size: stat.size,
		path: file,
		filename,
		stat,
	});

	return fs
		.stat(realPath)
		.then(createStat)
		.catch((error) => {
			core.logger.warn(error);

			return createStat({
				isDirectory: () => false,
				isFile: () => true,
				size: 0,
			});
		});
};

/**
 * Segment value map
 */
const segments = {
	root: {
		dynamic: false,
		fn: () => process.cwd(),
	},

	vfs: {
		dynamic: false,
		fn: (core) => core.config("vfs.root", process.cwd()),
	},

	username: {
		dynamic: true,
		fn: (core, session) => session.user.username,
	},
};

/**
 * Gets a segment value
 * @param {Core} core MeeseOS Core instance reference
 */
const getSegment = (core, session, seg) =>
	segments[seg] ? segments[seg].fn(core, session) : "";

/**
 * Matches a string for segments
 * @param {String} str
 * @returns {Array}
 */
const matchSegments = (str) => str.match(/(\{\w+\})/g) || [];

/**
 * Resolves a string with segments
 * @param {Core} core MeeseOS Core instance reference
 */
const resolveSegments = (core, session, str) =>
	matchSegments(str).reduce(
		(result, current) =>
			result.replace(
				current,
				getSegment(core, session, current.replace(/(\{|\})/g, ""))
			),
		str
	);

/**
 * Resolves a given file path based on a request
 * Will take out segments from the resulting string
 * and replace them with a list of defined variables.
 *
 * @param {Core} core MeeseOS Core instance reference
 * @param {*} session
 * @param {Object} mount
 * @param {String} file
 * @returns {String}
 */
const getRealPath = (core, session, mount, file) => {
	const root = resolveSegments(core, session, mount.attributes.root);
	const str = file.substr(mount.root.length - 1);
	return path.join(root, str);
};

/**
 * System VFS adapter
 * @param {Core} core MeeseOS Core instance reference
 * @param {Object} [options] Adapter options
 */
module.exports = (core) => {
	const wrapper = (method, cb, ...args) =>
		(vfs) =>
			(file, options = {}) => {
				const promise = Promise.resolve(
					getRealPath(core, options.session, vfs.mount, file)
				).then((realPath) => fs[method](realPath, ...args));

				return typeof cb === "function"
					? cb(promise, options)
					: promise.then(() => true);
			};

	const crossWrapper = (method) =>
		(srcVfs, destVfs) =>
			(src, dest, options = {}) =>
				Promise.resolve({
					realSource: getRealPath(core, options.session, srcVfs.mount, src),
					realDest: getRealPath(core, options.session, destVfs.mount, dest),
				})
					.then(({ realSource, realDest }) => fs[method](realSource, realDest))
					.then(() => true);

	return {
		watch: (mount, callback) => {
			const dest = resolveSegments(
				core,
				{
					user: {
						username: "**",
					},
				},
				mount.attributes.root
			);

			const watch = chokidar.watch(dest, mount.attributes.chokidar || {});
			const restr = dest.replace(/\*\*/g, "([^/]*)");
			const re = new RegExp(restr + "/(.*)");
			const seg = matchSegments(mount.attributes.root)
				.map((s) => s.replace(/\{|\}/g, ""))
				.filter((s) => segments[s].dynamic);

			const handle = (name) => (file) => {
				const test = re.exec(file);

				if (test && test.length > 0) {
					const args = seg.reduce((res, k, i) => ({ [k]: test[i + 1] }), {});
					callback(args, test[test.length - 1], name);
				}
			};

			const events = ["add", "addDir", "unlinkDir", "unlink"];
			events.forEach((name) => watch.on(name, handle(name)));

			return watch;
		},

		/**
		 * Checks if file exists
		 * @param {String} file The file path from client
		 * @param {Object} [options={}] Options
		 * @returns {Promise<boolean, Error>}
		 */
		exists: wrapper(
			"access",
			(promise) => {
				return promise.then(() => true).catch(() => false);
			},
			fs.F_OK
		),

		/**
		 * Get file statistics
		 * @param {String} file The file path from client
		 * @param {Object} [options={}] Options
		 * @returns {Object}
		 */
		stat: (vfs) =>
			(file, options = {}) =>
				Promise.resolve(
					getRealPath(core, options.session, vfs.mount, file)
				).then((realPath) => {
					return fs
						.access(realPath, fs.F_OK)
						.then(() => createFileIter(core, path.dirname(realPath), realPath));
				}),

		/**
		 * Reads directory
		 * @param {String} root The file path from client
		 * @param {Object} [options={}] Options
		 * @returns {Object[]}
		 */
		readdir: (vfs) =>
			(root, options) =>
				Promise.resolve(getRealPath(core, options.session, vfs.mount, root))
					.then((realPath) =>
						fs.readdir(realPath).then((files) => ({ realPath, files }))
					)
					.then(({ realPath, files }) => {
						const promises = files.map((file) =>
							createFileIter(core, realPath, root.replace(/\/?$/, "/") + file)
						);
						return Promise.all(promises);
					}),

		/**
		 * Reads file stream
		 * @param {String} file The file path from client
		 * @param {Object} [options={}] Options
		 * @returns {stream.Readable}
		 */
		readfile: (vfs) =>
			(file, options = {}) =>
				Promise.resolve(getRealPath(core, options.session, vfs.mount, file))
					.then((realPath) =>
						fs.stat(realPath).then((stat) => ({ realPath, stat }))
					)
					.then(({ realPath, stat }) => {
						if (!stat.isFile()) {
							return false;
						}

						const range = options.range || [];
						return fs.createReadStream(realPath, {
							flags: "r",
							start: range[0],
							end: range[1],
						});
					}),

		/**
		 * Creates directory
		 * @param {String} file The file path from client
		 * @param {Object} [options={}] Options
		 * @returns {Boolean}
		 */
		mkdir: wrapper("mkdir", (promise, options = {}) => {
			return promise
				.then(() => true)
				.catch((e) => {
					if (options.ensure && e.code === "EEXIST") {
						return true;
					}

					return Promise.reject(e);
				});
		}),

		/**
		 * Writes file stream
		 * @param {String} file The file path from client
		 * @param {stream.Readable} data The stream
		 * @param {Object} [options={}] Options
		 * @returns {Promise<boolean, Error>}
		 */
		writefile: (vfs) =>
			(file, data, options = {}) =>
				new Promise((resolve, reject) => {
					// FIXME: Currently this actually copies the file because
					// formidable will put this in a temporary directory.
					// It would probably be better to do a "rename()" on local filesystems
					const realPath = getRealPath(core, options.session, vfs.mount, file);

					const write = () => {
						const stream = fs.createWriteStream(realPath);
						data.on("error", (err) => reject(err));
						data.on("end", () => resolve(true));
						data.pipe(stream);
					};

					fs.stat(realPath)
						.then((stat) => {
							if (stat.isDirectory()) {
								resolve(false);
							} else {
								write();
							}
						})
						.catch((err) => (err.code === "ENOENT" ? write() : reject(err)));
				}),

		/**
		 * Renames given file or directory
		 * @param {String} src The source file path from client
		 * @param {String} dest The destination file path from client
		 * @param {Object} [options={}] Options
		 * @returns {Boolean}
		 */
		rename: crossWrapper("rename"),

		/**
		 * Copies given file or directory
		 * @param {String} src The source file path from client
		 * @param {String} dest The destination file path from client
		 * @param {Object} [options={}] Options
		 * @returns {Boolean}
		 */
		copy: crossWrapper("copy"),

		/**
		 * Removes given file or directory
		 * @param {String} file The file path from client
		 * @param {Object} [options={}] Options
		 * @returns {Boolean}
		 */
		unlink: wrapper("remove"),

		/**
		 * Searches for files and folders
		 * @param {String} file The file path from client
		 * @param {Object} [options={}] Options
		 * @returns {Boolean}
		 */
		search: (vfs) =>
			(root, pattern, options = {}) =>
				Promise.resolve(getRealPath(core, options.session, vfs.mount, root))
					.then((realPath) => {
						return fh
							.create()
							.paths(realPath)
							.match(pattern)
							.find()
							.then((files) => ({ realPath, files }))
							.catch((err) => {
								core.logger.warn(err);

								return { realPath, files: [] };
							});
					})
					.then(({ realPath, files }) => {
						const promises = files.map((file) => {
							const rf = file.substr(realPath.length);
							return createFileIter(
								core,
								path.dirname(realPath.replace(/\/?$/, "/") + rf),
								root.replace(/\/?$/, "/") + rf
							);
						});
						return Promise.all(promises);
					}),

		/**
		 * Touches a file
		 * @param {String} file The file path from client
		 * @param {Object} [options={}] Options
		 * @returns {Boolean}
		 */
		touch: wrapper("ensureFile"),

		/**
		 * Gets the real filesystem path (internal only)
		 * @param {String} file The file path from client
		 * @param {Object} [options={}] Options
		 * @returns {String}
		 */
		realpath: (vfs) =>
			(file, options = {}) =>
				Promise.resolve(getRealPath(core, options.session, vfs.mount, file)),
	};
};
