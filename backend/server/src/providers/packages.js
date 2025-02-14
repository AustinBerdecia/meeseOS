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
const chokidar = require("chokidar");
const { ServiceProvider } = require("@meeseOS/common");
const Packages = require("../packages");
const { closeWatches } = require("../utils/core");

/**
 * MeeseOS Package Service Provider
 */
class PackageServiceProvider extends ServiceProvider {
	constructor(core) {
		super(core);

		const { configuration } = this.core;
		const manifestFile = path.join(
			configuration.public,
			configuration.packages.metadata
		);
		const discoveredFile = path.resolve(
			configuration.root,
			configuration.packages.discovery
		);

		this.watches = [];
		this.packages = new Packages(core, {
			manifestFile,
			discoveredFile,
		});
	}

	provides() {
		return ["meeseOS/packages"];
	}

	init() {
		this.core.singleton("meeseOS/packages", () => this.packages);

		return this.packages.init();
	}

	start() {
		this.packages.start();

		if (this.core.configuration.development) {
			this.initDeveloperTools();
		}
	}

	async destroy() {
		await closeWatches(this.watches);
		await this.packages.destroy();
		super.destroy();
	}

	/**
	 * Initializes some developer features
	 */
	initDeveloperTools() {
		const { manifestFile } = this.packages.options;

		if (fs.existsSync(manifestFile)) {
			const watcher = chokidar.watch(manifestFile);
			watcher.on("change", () => {
				this.core.broadcast("meeseOS/packages:metadata:changed");
			});
			this.watches.push(watcher);
		}
	}
}

module.exports = PackageServiceProvider;
