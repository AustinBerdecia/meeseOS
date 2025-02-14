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

import { Box, TextField } from "@meeseOS/gui";
import { app, h } from "hyperapp";
import Dialog from "../dialog";

/**
 * Default MeeseOS Prompt Dialog
 */
export default class PromptDialog extends Dialog {
	/**
	 * Constructor
	 * @param {Core} core MeeseOS Core instance reference
	 * @param {Object} args Arguments given from service creation
	 * @param {String} [args.title] Dialog title
	 * @param {String} [args.message] Dialog message
	 * @param {Function} callback The callback function
	 */
	constructor(core, args, callback) {
		super(
			core,
			{

				value: "",
				placeholder: "",
				...args
			},
			{
				className: "prompt",
				buttons: ["ok", "cancel"],
				window: {
					title: args.title || "Prompt",
					attributes: {
						minDimension: {
							width: 500,
							height: 200,
						},
					},
				},
			},
			callback
		);

		this.value = this.args.value;
	}

	render(options) {
		super.render(options, ($content) => {
			app(
				{
					value: this.args.value,
				},
				{
					setValue: (value) => (state) => {
						this.value = value;
						return { value };
					},
				},
				(state, actions) =>
					this.createView([
						h(Box, { grow: 1, padding: false }, [
							h(
								Box,
								{ class: "meeseOS-dialog-message" },
								String(this.args.message)
							),
							h(TextField, {
								value: state.value,
								placeholder: this.args.placeholder,
								onenter: (ev, value) => {
									actions.setValue(value);

									this.emitCallback(this.getPositiveButton(), ev, true);
								},
								oninput: (ev, value) => actions.setValue(value),
							}),
						]),
					]),
				$content
			);
		});
	}
}
