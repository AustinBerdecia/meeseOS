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
 * @license Simplified BSD License
 */

export as namespace meeseOS__client;

import { EventEmitter } from "@meeseOS/event-emitter";

declare class ServiceProvider {
	/**
	 * Core instance reference
	 */
	readonly core: CoreBase;

	/**
	 * Provider options
	 */
	readonly options: any;

	/**
	 * Constructor
	 */
	constructor(core: CoreBase, options: any);

	/**
	 * List of provided services
	 */
	provides(): string[];

	/**
	 * Initializes Provider
	 */
	init(): Promise<any>;

	/**
	 * Starts Provider
	 */
	start(): Promise<any>;

	/**
	 * Destroys Provider
	 */
	destroy(): void;
}

declare class CoreBase extends EventEmitter {
	/**
	 * Logger module
	 */
	readonly logger: any;

	/**
	 * Configuration Tree
	 */
	readonly configuration: any;

	/**
	 * Options
	 */
	readonly options: any;

	/**
	 * Boot has been initiated
	 */
	booted: boolean;

	/**
	 * Fully started
	 */
	started: boolean;

	/**
	 * Fully destroyped
	 */
	destroyd: boolean;

	/**
	 * Service Provider Handler
	 */
	providers: any;

	/**
	 * Constructor
	 */
	constructor(name?: string);

	/**
	 * Destroy core instance
	 */
	destroy(): void;

	/**
	 * Boots up MeeseOS
	 */
	boot(): Promise<boolean>;

	/**
	 * Starts all core services
	 */
	start(): Promise<boolean>;

	/**
	 * Gets a configuration entry by key
	 */
	config(key: string, defaultValue: any): any;

	/**
	 * Register a service provider
	 */
	register(ref: typeof ServiceProvider, options: any): void;

	/**
	 * Register a instanciator provider
	 */
	instance(name: string, callback: Function): void;

	/**
	 * Register a singleton provider
	 */
	singleton(name: string, callback: Function): void;

	/**
	 * Create an instance of a provided service
	 */
	make<T>(name: string, ...args: any[]): T;

	/**
	 * Check if a service exists
	 */
	has(name: string): boolean;
}

declare class Websocket extends EventEmitter {
	/**
	 * Create a new Websocket
	 */
	constructor(name: string, uri: string, options?: WebsocketOptions);

	/**
	 * Socket URI
	 */
	readonly uri: string;

	/**
	 * If socket is closed
	 */
	closed: boolean;

	/**
	 * If socket is connected
	 */
	connected: boolean;

	/**
	 * If socket is connecting
	 */
	connecting: boolean;

	/**
	 * If socket is reconnecting
	 */
	reconnecting: boolean;

	/**
	 * If socket failed to connect
	 */
	connectfailed: boolean;

	/**
	 * Options
	 */
	readonly options: WebsocketOptions;

	/**
	 * The Websocket
	 */
	connection: WebSocket;

	/**
	 * Destroys the current connection
	 */
	private _destroyConnection;

	/**
	 * Attaches internal events
	 */
	private _attachEvents;

	/**
	 * Opens the connection
	 */
	open(reconnect?: boolean): void;

	/**
	 * Wrapper for sending data
	 */
	send(...args: any[]): void;

	/**
	 * Wrapper for closing
	 */
	close(...args: any[]): void;
}

/**
 * Websocket options
 */
export type WebsocketOptions = {
	/**
	 * Enable reconnection
	 */
	reconnect?: boolean;

	/**
	 * Reconnect interval
	 */
	interval?: number;

	/**
	 * Immediately open socket after creation
	 */
	open?: boolean;
};

declare class Splash {
	/**
	 * Create Splash
	 */
	constructor(core: Core);

	/**
	 * Core instance reference
	 */
	readonly core: Core;

	/**
	 * Splash root element
	 */
	readonly $loading: Element;

	/**
	 * Initializes splash
	 */
	init(): void;

	/**
	 * Shows splash
	 */
	show(): void;

	/**
	 * Destroys splash
	 */
	destroy(): void;
}

declare class Window extends EventEmitter {
	/**
	 * Get a list of all windows
	 */
	static getWindows(): Window[];

	/**
	 * Gets the lastly focused Window
	 */
	static lastWindow(): Window;

	/**
	 * Create window
	 */
	constructor(core: Core, options?: WindowOptions);

	/**
	 * The Window ID
	 */
	readonly id: string;

	/**
	 * The Window ID
	 */
	readonly wid: number;

	/**
	 * Parent Window reference
	 */
	readonly parent: Window;

	/**
	 * Child windows (via 'parent')
	 */
	children: Window[];

	/**
	 * Core instance reference
	 */
	readonly core: Core;

	/**
	 * The window destruction state
	 */
	destroyed: boolean;

	/**
	 * The window rendered state
	 */
	rendered: boolean;

	/**
	 * The window was inited
	 */
	inited: boolean;

	/**
	 * The window attributes
	 */
	attributes: WindowAttributes;

	/**
	 * The window state
	 */
	state: WindowState;

	/**
	 * The window container
	 */
	readonly $element: Element;

	/**
	 * The content container
	 */
	$content: Element;

	/**
	 * The header container
	 */
	$header: Element;

	/**
	 * The icon container
	 */
	$icon: Element;

	/**
	 * The title container
	 */
	$title: Element;

	/**
	 * Internal variable to signal not to use default position
	 * given by user (used for restore)
	 */
	private _preventDefaultPosition;

	/**
	 * Internal timeout reference used for triggering the loading
	 * overlay.
	 */
	private _loadingDebounce;

	/**
	 * The window template
	 */
	private _template;

	/**
	 * Custom destructor callback
	 */
	private readonly _ondestroy;

	/**
	 * Last DOM update CSS text
	 */
	private _lastCssText;

	/**
	 * Last DOM update data attributes
	 */
	private _lastAttributes;

	/**
	 * Destroy window
	 */
	destroy(): void;

	/**
	 * Initialize window
	 */
	init(): Window;

	/**
	 * Initializes window template
	 */
	private _initTemplate;

	/**
	 * Initializes window behavior
	 */
	private _initBehavior;

	/**
	 * Checks the modal state of the window upon render
	 */
	private _checkModal;

	/**
	 * Sets the initial class names
	 */
	private _setClassNames;

	/**
	 * Render window
	 */
	render(callback?: Function): Window;

	/**
	 * Close the window
	 */
	close(): boolean;

	/**
	 * Focus the window
	 */
	focus(): boolean;

	/**
	 * Internal for focus
	 */
	private _focus;

	/**
	 * Blur (un-focus) the window
	 */
	blur(): boolean;

	/**
	 * Minimize (hide) the window
	 */
	minimize(): boolean;

	/**
	 * Raise (un-minimize) the window
	 */
	raise(): boolean;

	/**
	 * Maximize the window
	 */
	maximize(): boolean;

	/**
	 * Restore (un-maximize) the window
	 */
	restore(): boolean;

	/**
	 * Internal for Maximize or restore
	 */
	private _maximize;

	/**
	 * Resize to fit to current container
	 */
	resizeFit(container?: Element): void;

	/**
	 * Clamps the position to viewport
	 */
	clampToViewport(update?: boolean): void;

	/**
	 * Set the Window icon
	 */
	setIcon(uri: string): void;

	/**
	 * Set the Window title
	 */
	setTitle(title: string): void;

	/**
	 * Set the Window dimension
	 */
	setDimension(dimension: WindowDimension): void;

	/**
	 * Set the Window position
	 */
	setPosition(position: WindowPosition, preventDefault?: boolean): void;

	/**
	 * Set the Window z index
	 */
	setZindex(zIndex: number): void;

	/**
	 * Sets the Window to next z index
	 */
	setNextZindex(force?: boolean): void;

	/**
	 * Set a state by value
	 */
	setState(name: string, value: any, update?: boolean): void;

	/**
	 * Gravitates window towards a certain area
	 */
	gravitate(gravity: string): void;

	/**
	 * Gets a astate
	 */
	getState(n: any): any;

	/**
	 * Get a snapshot of the Window session
	 */
	getSession(): WindowSession;

	/**
	 * Internal method for setting state
	 */
	private _setState;

	/**
	 * Internal method for toggling state
	 */
	private _toggleState;

	/**
	 * Check if we have to set next zindex
	 */
	private _checkNextZindex;
	_updateDOM(): void;

	/**
	 * Updates the window buttons in DOM
	 */
	private _updateButtons;

	/**
	 * Updates window title in DOM
	 */
	private _updateTitle;

	/**
	 * Updates window icon decoration in DOM
	 */
	private _updateIconStyles;

	/**
	 * Updates window header decoration in DOM
	 */
	private _updateHeaderStyles;

	/**
	 * Updates window data in DOM
	 */
	private _updateAttributes;

	/**
	 * Updates window style in DOM
	 */
	private _updateStyles;
}

/**
 * Window dimension definition
 */
export type WindowDimension = {
	/**
	 * Width in pixels (or float for percentage in setters)
	 */
	width: number;

	/**
	 * Height in pixels (or float for percentage in setters)
	 */
	height: number;
};

/**
 * Window position definition
 */
export type WindowPosition = {
	/**
	 * Left in pixels (or float for percentage in setters)
	 */
	left: number;

	/**
	 * Top in pixels (or float for percentage in setters)
	 */
	top: number;
};

/**
 * Window session
 */
export type WindowSession = {
	id: number;
	maximized: boolean;
	minimized: boolean;
	position: WindowPosition;
	dimension: WindowDimension;
};

/**
 * Window attributes definition
 */
export type WindowAttributes = {
	/**
	 * A list of class names
	 */
	classNames?: string[];

	/**
	 * If always on top
	 */
	ontop?: boolean;

	/**
	 * Gravity (center/top/left/right/bottom or any combination)
	 */
	gravity?: string;

	/**
	 * If resizable
	 */
	resizable?: boolean;

	/**
	 * If focusable
	 */
	focusable?: boolean;

	/**
	 * If window if maximizable
	 */
	maximizable?: boolean;

	/**
	 * If minimizable
	 */
	minimizable?: boolean;

	/**
	 * If moveable
	 */
	moveable?: boolean;

	/**
	 * If closeable
	 */
	closeable?: boolean;

	/**
	 * Show header
	 */
	header?: boolean;

	/**
	 * Show controls
	 */
	controls?: boolean;

	/**
	 * Global visibility, 'restricted' to hide from window lists etc.
	 */
	visibility?: string;

	/**
	 * Clamp the window position upon creation
	 */
	clamp?: boolean;

	/**
	 * If window should have the default drop action
	 */
	droppable?: boolean;

	/**
	 * Minimum dimension
	 */
	minDimension?: WindowDimension;

	/**
	 * Maximum dimension
	 */
	maxDimension?: WindowDimension;

	/**
	 * A map of matchMedia to name
	 */
	mediaQueries?: {
		name: string;
	};
};

/**
 * Window state definition
 */
export type WindowState = {
	/**
	 * Title
	 */
	title: string;

	/**
	 * Icon
	 */
	icon: string;

	/**
	 * If moving
	 */
	moving?: boolean;

	/**
	 * If resizing
	 */
	resizing?: boolean;

	/**
	 * If loading
	 */
	loading?: boolean;

	/**
	 * If focused
	 */
	focused?: boolean;

	/**
	 * If maximized
	 */
	maximized?: boolean;

	/**
	 * If mimimized
	 */
	mimimized?: boolean;

	/**
	 * If modal to the parent
	 */
	modal?: boolean;

	/**
	 * The z-index (auto calculated)
	 */
	zIndex?: number;

	/**
	 * Position
	 */
	position?: WindowPosition;

	/**
	 * Dimension
	 */
	dimension?: WindowDimension;
};

/**
 * Window options definition
 */
export type WindowOptions = {
	/**
	 * Window Id (not globaly unique)
	 */
	id: string;

	/**
	 * Window Title
	 */
	title?: string;

	/**
	 * Window Icon
	 */
	icon?: string;

	/**
	 * The parent Window reference
	 */
	parent?: Window;

	/**
	 * The Window HTML template (or function with signature (el, win) for programatic construction)
	 */
	template?: string | Function;

	/**
	 * A callback function when window destructs to interrupt the procedure
	 */
	ondestroy?: Function;

	/**
	 * Window position
	 */
	position?: WindowPosition | string;

	/**
	 * Window dimension
	 */
	dimension?: WindowDimension;

	/**
	 * Apply Window attributes
	 */
	attributes?: WindowAttributes;

	/**
	 * Apply Window state
	 */
	state?: WindowState;
};

declare class Application extends EventEmitter {
	/**
	 * Get a list of all running applications
	 */
	static getApplications(): Application[];

	/**
	 * Kills all running applications
	 */
	static destroyAll(): void;

	/**
	 * Create application
	 */
	constructor(core: Core, data: ApplicationData);

	/**
	 * The Application ID
	 */
	readonly pid: number;

	/**
	 * Core instance reference
	 */
	readonly core: Core;

	/**
	 * Application arguments
	 */
	args: {
		foo: any;
	};

	/**
	 * Application options
	 */
	options: ApplicationOptions;

	/**
	 * Application metadata
	 */
	readonly metadata: any;

	/**
	 * Window list
	 */
	windows: Window[];

	/**
	 * Worker instances
	 */
	workers: Worker[];

	/**
	 * Options for internal fetch/requests
	 */
	requestOptions: object;

	/**
	 * The application destruction state
	 */
	destroyed: boolean;

	/**
	 * Application settings
	 */
	settings: {
		foo: any;
	};

	/**
	 * Application started time
	 */
	readonly started: Date;

	/**
	 * Application WebSockets
	 */
	sockets: Websocket[];

	/**
	 * Destroy application
	 */
	destroy(remove?: boolean): void;

	/**
	 * Re-launch this application
	 */
	relaunch(): void;

	/**
	 * Gets a URI to a resource for this application
	 * If given path is an URI it will just return itself.
	 */
	resource(path?: string, options?: object): string;

	/**
	 * Performs a request to the MeeseOS server with the application
	 * as the endpoint.
	 */
	request(path?: string, options?: any, type?: string): Promise<any>;

	/**
	 * Creates a new Websocket
	 */
	socket(path?: string, options?: any): Websocket;

	/**
	 * Sends a message over websocket via the core connection.
	 * This does not create a new connection, but rather uses the core connection.
	 * For subscribing to messages from the server use the 'ws:message' event
	 */
	send(...args: any[]): void;

	/**
	 * Creates a new Worker
	 */
	worker(filename: string, options?: object): Worker;

	/**
	 * Create a new window belonging to this application
	 */
	createWindow(options?: any): Window;

	/**
	 * Removes window(s) based on given filter
	 */
	removeWindow(filter: Function): void;

	/**
	 * Gets a snapshot of the application session
	 */
	getSession(): ApplicationSession;

	/**
	 * Saves settings
	 */
	saveSettings(): Promise<boolean>;
}

/**
 * Application Options
 */
export type ApplicationOptions = {
	/**
	 * Initial settings
	 */
	settings?: object;

	/**
	 * Restore data
	 */
	restore?: object;

	/**
	 * Auto-focus first created window
	 */
	windowAutoFocus?: boolean;

	/**
	 * Allow session storage
	 */
	sessionable?: boolean;
};

/**
 * Application Data
 */
export type ApplicationData = {
	/**
	 * Launch arguments
	 */
	args: {
		foo: any;
	};

	/**
	 * Options
	 */
	options?: ApplicationOptions;

	/**
	 * Package Metadata
	 */
	metadata?: any;
};

/**
 * Application Session
 */
export type ApplicationSession = {
	args: {
		foo: string;
	};
	name: string;
	windows: any[];
};

declare class Core extends CoreBase {
	/**
	 * Create core instance
	 */
	constructor(config?: any, options?: CoreOptions);

	/**
	 * Websocket connection
	 */
	ws: Websocket;

	/**
	 * Ping (stay alive) interval
	 */
	ping: number;

	/**
	 * Splash instance
	 */
	readonly splash: Splash;

	/**
	 * Main DOM element
	 */
	readonly $root: Element;

	/**
	 * Windows etc DOM element
	 */
	readonly $contents: Element;

	/**
	 * Resource script container DOM element
	 */
	readonly $resourceRoot: Element;

	/**
	 * Default fetch request options
	 */
	requestOptions: any;

	/**
	 * Url Resolver
	 */
	readonly urlResolver: () => string;

	/**
	 * Current user data
	 */
	readonly user: CoreUserData;

	/**
	 * Attaches some internal events
	 */
	private _attachEvents;

	/**
	 * Creates the main connection to server
	 */
	private _createConnection;

	/**
	 * Creates event listeners*
	 */
	private _createListeners;

	/**
	 * Creates an URL based on configured public path
	 * If you give a options.type, the URL will be resolved
	 * to the correct resource.
	 */
	url(
		endpoint?: string,
		options?: {
			prefix: boolean;
			type: string;
		},
		metadata?: any
	): string;

	/**
	 * Make a HTTP request
	 * This is a wrapper for making a 'fetch' request with some helpers
	 * and integration with MeeseOS
	 */
	request(url: string, options?: any, type?: string, force?: boolean): any;

	/**
	 * Create an application from a package
	 */
	run(
		name: string,
		args?: {
			foo: any;
		},
		options?: any
	): Promise<Application>;

	/**
	 * Spawns an application based on the file given
	 */
	open(file: any, options?: any): boolean | Application;

	/**
	 * Wrapper method to create an application choice dialog
	 */
	private _openApplicationDialog;

	/**
	 * Sends a 'broadcast' event with given arguments
	 * to all applications matching given filter
	 */
	broadcast(pkg: string | Function, name: string, ...args: any[]): string[];

	/**
	 * Sends a signal to the server over websocket.
	 * This will be interpreted as an event in the server core.
	 */
	send(name: string, ...params: any[]);

	/**
	 * Set the internal fetch/request options
	 */
	setRequestOptions(options: object): void;

	/**
	 * Gets the current user
	 */
	getUser(): CoreUserData;

	/**
	 * Add middleware function to a group
	 */
	middleware(group: string, callback: Function): void;
}

export type SplashCallback = (core: Core) => Splash;

/**
 * User Data
 */
export type CoreUserData = {
	username: string;
	id?: number;
	groups?: string[];
};

/**
 * Core Options
 */
export type CoreOptions = {
	/**
	 * The root DOM element for elements
	 */
	root?: Element;
	/**
	 * The root DOM element for resources
	 */
	resourceRoot?: Element;
	/**
	 * List of class names to apply to root dom element
	 */
	classNames?: string[];
	/**
	 * Custom callback function for creating splash screen
	 */
	splash?: SplashCallback | Splash;
};

declare class Search {
	/**
	 * Create Search instance
	 */
	constructor(core: Core);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Wired actions
	 */
	ui: any;
	/**
	 * Last focused window
	 */
	focusLastWindow: Window;
	/**
	 * Search root DOM element
	 */
	readonly $element: Element;
	/**
	 * Destroy Search instance
	 */
	destroy(): void;
	/**
	 * Initializes Search Service
	 */
	init(): void;
	/**
	 * Performs a search across all mounts
	 */
	search(pattern: string): Promise<any[]>;
	/**
	 * Focuses UI
	 */
	focus(): void;
	/**
	 * Hides UI
	 */
	hide(): void;
	/**
	 * Shows UI
	 */
	show(): void;
}

declare class DesktopIconView extends EventEmitter {
	constructor(core: Core);
	core: Core;
	$root: HTMLDivElement;
	iconview: any;
	root: string;
	destroy(): void;
	_render(root: any): boolean;
	render(root: any): void;
	createFileContextMenu(ev: any, entry: any): void;
	createDropContextMenu(ev: any, data: any, files: any): void;
	createRootContextMenu(ev: any): void;
	_createWatcher(): void;
	applySettings(): void;
}

declare class Desktop extends EventEmitter {
	/**
	 * Create Desktop
	 */
	constructor(core: Core, options?: any);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Desktop Options
	 */
	readonly options: DeskopOptions;
	/**
	 * Theme DOM elements
	 */
	$theme: Element[];
	/**
	 * Icon DOM elements
	 */
	$icons: Element[];
	/**
	 * Default context menu entries
	 */
	contextmenuEntries: DesktopContextMenuEntry[];
	/**
	 * Search instance
	 */
	readonly search: Search | null;
	/**
	 * Icon View instance
	 */
	readonly iconview: DesktopIconView;
	/**
	 * Keyboard context dom element
	 */
	keyboardContext: Element | null;
	/**
	 * Desktop subtraction rectangle
	 */
	subtract: DesktopViewportRectangle;
	/**
	 * Destroy Desktop
	 */
	destroy(): void;
	/**
	 * Initializes Desktop
	 */
	init(): void;
	/**
	 * Initializes connection events
	 */
	initConnectionEvents(): void;
	/**
	 * Initializes user interface events
	 */
	initUIEvents(): void;
	/**
	 * Initializes development tray icons
	 */
	initDeveloperTray(): void;
	/**
	 * Initializes drag-and-drop events
	 */
	initDragEvents(): void;
	/**
	 * Initializes keyboard events
	 */
	initKeyboardEvents(): void;
	/**
	 * Initializes global keyboard events
	 */
	initGlobalKeyboardEvents(): void;
	/**
	 * Initializes mouse events
	 */
	initMouseEvents(): void;
	/**
	 * Initializes base events
	 */
	initBaseEvents(): void;
	/**
	 * Starts desktop services
	 */
	start(): void;
	/**
	 * Update CSS
	 */
	private _updateCSS;
	/**
	 * Adds something to the default contextmenu entries
	 */
	addContextMenu(entries: DesktopContextMenuEntry[]): void;
	/**
	 * Applies settings and updates desktop
	 */
	applySettings(settings?: DesktopSettings): DesktopSettings;
	/**
	 * Removes current style theme from DOM
	 */
	private _removeTheme;
	/**
	 * Removes current icon theme from DOM
	 */
	private _removeIcons;
	/**
	 * Adds or removes the icon view
	 */
	applyIconView(settings: DesktopIconViewSettings): void;
	/**
	 * Sets the current icon theme from settings
	 */
	applyIcons(name: string): Promise<undefined>;
	/**
	 * Sets the current style theme from settings
	 */
	applyTheme(name: string): Promise<undefined>;
	/**
	 * Apply theme wrapper
	 */
	private _applyTheme;
	/**
	 * Apply settings by key
	 */
	private _applySettingsByKey;
	/**
	 * Create drop context menu entries
	 */
	createDropContextMenu(data: any): any[];
	/**
	 * When developer menu is shown
	 */
	onDeveloperMenu(ev: Event): void;
	/**
	 * When drop menu is shown
	 */
	onDropContextMenu(ev: Event, data: any): void;
	/**
	 * When context menu is shown
	 */
	onContextMenu(ev: Event): void;
	/**
	 * Sets the keyboard context.
	 * Used for tabbing and other special events
	 */
	setKeyboardContext(ctx?: Element): void;
	/**
	 * Gets the rectangle of available space
	 * This is based on any panels etc taking up space
	 */
	getRect(): DesktopViewportRectangle;
}

export type DesktopContextMenuEntry = any;
export type DesktopIconViewSettings = any;
export type DesktopSettings = {
	iconview?: DesktopIconViewSettings;
};

/**
 * Desktop Options
 */
export type DeskopOptions = {
	/**
	 * Default Context menu items
	 */
	contextmenu?: object[];
};

/**
 * Desktop Viewport Rectangle
 */
export type DesktopViewportRectangle = {
	left: number;
	top: number;
	right: number;
	bottom: number;
};

declare class Notification {
	/**
	 * Create notification
	 */
	constructor(core: Core, root: Element, options?: NotificationOptions);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Root node reference
	 */
	readonly $root: Element;
	/**
	 * Notification DOM node
	 */
	readonly $element: Element;
	/**
	 * The notification destruction state
	 */
	readonly destroyed: boolean;
	/**
	 * Options
	 */
	readonly options: NotificationOptions;
	/**
	 * Destroy notification
	 */
	destroy(): void;
	/**
	 * Render notification
	 */
	render(): Promise<boolean>;
}

/**
 * Notification Options
 */
export type NotificationOptions = {
	/**
	 * Title
	 */
	title: string;
	/**
	 * Message
	 */
	message: string;
	/**
	 * Sound to play
	 */
	sound?: string;
	/**
	 * Icon source
	 */
	icon?: string;
	/**
	 * Timeout value (0=infinite)
	 */
	timeout?: number;
	/**
	 * Adds a DOM class name to notification
	 */
	className?: string;
};

declare class Notifications {
	/**
	 */
	constructor(core: Core);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 */
	$element: Element;
	/**
	 * Destroy notification handler
	 */
	destroy(): void;
	/**
	 * Initialize notification handler
	 */
	init(): void;
	/**
	 * Create a new notification
	 */
	create(options: NotificationOptions): Notification;
	/**
	 * Sets the element styles
	 */
	setElementStyles(): void;
	/**
	 * Creates a new CSS style object
	 */
	createElementStyles(): {
		property: string;
	};
}
declare class WindowBehavior {
	/**
	 * Create window behavior
	 */
	constructor(core: Core);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Last action
	 */
	lastAction: string;
	/**
	 * LoFi DOM Element
	 */
	readonly $lofi: Element;
	/**
	 * Initializes window behavior
	 */
	init(win: Window): void;
	/**
	 * Handles Mouse Click Event
	 */
	click(ev: Event, win: Window): void;
	/**
	 * Handles Mouse Double Click Event
	 */
	dblclick(ev: Event, win: Window): void;
	/**
	 * Handles Mouse Down Event
	 */
	mousedown(ev: Event, win: Window): void;
	/**
	 * Handles Icon Double Click Event
	 */
	iconDblclick(ev: Event, win: Window): void;
	/**
	 * Handles Icon Click Event
	 */
	iconClick(ev: Event, win: Window): void;
}

declare class Login extends EventEmitter {
	/**
	 * Create authentication handler
	 */
	constructor(core: Core, options?: LoginOptions);
	/**
	 * Login root DOM element
	 */
	$container: Element;
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Login options
	 */
	readonly options: any;
	/**
	 * Initializes the UI
	 */
	init(startHidden: any): void;
	/**
	 * Destroys the UI
	 */
	destroy(): void;
	/**
	 * Renders the UI
	 */
	render(startHidden: any): void;
}

/**
 * Login Options
 */
export type LoginOptions = {
	/**
	 * Title
	 */
	title?: string;
	/**
	 * Fields
	 */
	fields?: object[];
};

declare class Auth {
	/**
	 */
	constructor(core: Core, options?: AuthSettings);
	/**
	 * Authentication UI
	 */
	readonly ui: Login;
	/**
	 * Authentication adapter
	 */
	readonly adapter: AuthAdapter;
	/**
	 * Authentication callback function
	 */
	readonly callback: AuthCallback;
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Initializes authentication handler
	 */
	init(): any;
	/**
	 * Destroy authentication handler
	 */
	destroy(): void;
	/**
	 * Run the shutdown procedure
	 */
	shutdown(reload?: boolean): void;
	/**
	 * Shows Login UI
	 */
	show(cb: AuthCallback): Promise<boolean>;
	/**
	 * Performs a login
	 */
	login(values: AuthForm): Promise<boolean>;
	/**
	 * Performs a logout
	 */
	logout(reload?: boolean): Promise<boolean>;
	/**
	 * Performs a register call
	 */
	register(values: AuthForm): Promise<any>;
}

export type AuthAdapter = any;
export type AuthAdapterConfig = any;
export type AuthForm = {
	username?: string;
	password?: string;
};

export type AuthAdapterCallback = (core: Core) => AuthAdapter;
export type LoginAdapterCallback = (core: Core) => Login;
export type AuthCallback = (data: AuthForm) => boolean;
export type AuthSettings = {
	/**
	 * Adapter to use
	 */
	adapter?: AuthAdapterCallback | AuthAdapter;
	/**
	 * Login Adapter to use
	 */
	login?: LoginAdapterCallback | Login;
	/**
	 * Adapter configuration
	 */
	config?: AuthAdapterConfig;
};

declare class Session {
	/**
	 * Creates the Session Handler
	 */
	constructor(core: Core);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Destroys instance
	 */
	destroy(): void;
	/**
	 * Saves session
	 */
	save(): Promise<boolean>;
	/**
	 * Loads session
	 */
	load(fresh?: boolean): Promise<boolean>;
}
declare class Tray {
	/**
	 * Creates the Tray Handler
	 */
	constructor(core: Core);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * All Tray entries
	 */
	entries: TrayEntry[];
	/**
	 * Destroys instance
	 */
	destroy(): void;
	/**
	 * Creates a new Tray entry
	 */
	create(options: TrayEntryData, handler?: Function): TrayEntry;
	/**
	 * Removes a Tray entry
	 */
	remove(entry: TrayEntry): void;
	/**
	 */
	list(): TrayEntry[];

	/**
	 */
	has(key): boolean;
}

/**
 * Tray Icon Data
 */
export type TrayEntryData = {
	/**
	 * Icon source
	 */
	icon?: string;
	/**
	 * The title and tooltip
	 */
	title?: string;
	/**
	 * The callback function for clicks
	 */
	onclick?: Function;
	/**
	 * The callback function for contextmenu
	 */
	oncontextmenu?: Function;
};

/**
 * Tray Icon Entry
 */
export type TrayEntry = {
	/**
	 * The given entry data
	 */
	entry: TrayEntryData;
	/**
	 * Updates entry with given data
	 */
	update: Function;
	/**
	 * Destroy the entry
	 */
	destroy: Function;
};
declare class Preloader {
	constructor(root: any);
	/**
	 * A list of cached preloads
	 */
	loaded: string[];
	/**
	 */
	$root: Element;
	destroy(): void;
	/**
	 * Loads all resources required for a package
	 */
	load(list: string[], force?: boolean): Promise<PreloaderResult>;
	/**
	 * Checks the loaded list
	 */
	private _load;
}

export type PreloaderEntryElement = HTMLScriptElement | HTMLLinkElement;
export type PreloaderResult = {
	errors: string[];
	elements: {
		string: PreloaderEntryElement;
	};
};
declare class Packages {
	/**
	 * Create package manage
	 */
	constructor(core: Core);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * A list of registered packages
	 */
	packages: PackageReference[];
	/**
	 * The lost of loaded package metadata
	 */
	metadata: PackageMetadata[];
	/**
	 * A list of running application names
	 * Mainly used for singleton awareness
	 */
	private _running;
	/**
	 * Preloader
	 */
	readonly preloader: Preloader;
	/**
	 * If inited
	 */
	inited: boolean;
	/**
	 * Destroy package manager
	 */
	destroy(): void;
	/**
	 * Initializes package manager
	 */
	init(): Promise<boolean>;
	/**
	 * Launches a (application) package
	 */
	launch(
		name: string,
		args?: {
			foo: any;
		},
		options?: PackageLaunchOptions
	): Promise<Application>;
	/**
	 * Launches an application package
	 */
	private _launchApplication;
	/**
	 * Launches a (theme) package
	 */
	private _launchTheme;
	/**
	 * Wrapper for launching a (application) package
	 */
	private _launch;
	/**
	 * Autostarts tagged packages
	 */
	private _autostart;
	/**
	 * Registers a package
	 */
	register(name: string, callback: Function): void;
	/**
	 * Adds a set of packages
	 */
	addPackages(list: PackageMetadata[]): PackageMetadata[];
	/**
	 * Gets a list of packages (metadata)
	 */
	getPackages(filter?: Function): PackageMetadata[];
	/**
	 * Gets a list of packages compatible with the given mime type
	 */
	getCompatiblePackages(mimeType: string): PackageMetadata[];
	/**
	 * Gets a list of running packages
	 */
	running(): string[];
}

/**
 * A registered package reference
 */
export type PackageReference = {
	/**
	 * Package metadata
	 */
	metadata: PackageMetadata;
	/**
	 * Callback to instanciate
	 */
	callback: Function;
};

/**
 * A package metadata
 */
export type PackageMetadata = {
	/**
	 * The package name
	 */
	name: string;
	/**
	 * Package category
	 */
	category?: string;
	/**
	 * Package icon
	 */
	icon?: string;
	/**
	 * If only one instance allowed
	 */
	singleton?: boolean;
	/**
	 * Autostart on boot
	 */
	autostart?: boolean;
	/**
	 * Hide from launch menus etc.
	 */
	hidden?: boolean;
	/**
	 * Server script filename
	 */
	server?: string;
	/**
	 * Only available for users in this group
	 */
	groups?: string[];
	/**
	 * Files to preload
	 */
	files?: Array<object | string>;
	/**
	 * A string package title
	 */
	title: string;
	/**
	 * A string description of a package
	 */
	description: string;
};

/**
 * Package Launch Options
 */
export type PackageLaunchOptions = {
	/**
	 * Force preload reloading
	 */
	forcePreload?: boolean;
};

declare class Clipboard {
	/**
	 */
	clipboard: ClipboardData;
	/**
	 * Destroy clipboard
	 */
	destroy(): void;
	/**
	 * Clear clipboard
	 */
	clear(): void;
	/**
	 * Set clipboard data
	 */
	set(data: any, type?: string): void;
	/**
	 * Checks if current clipboard data has this type
	 */
	has(type: string | RegExp): boolean;
	/**
	 * Gets clipboard data
	 */
	get(clear?: boolean): Promise<any>;
}

/**
 * Clipboard Data
 */
export type ClipboardData = {
	/**
	 * Optional data type
	 */
	type?: string;
	data: any;
};

declare class Middleware {
	middleware: MiddlewareData;
	/**
	 * Destroy middleware
	 */
	destroy(): void;
	/**
	 * Clear middleware
	 */
	clear(): void;
	/**
	 * Add middleware function to a group
	 */
	add(group: string, callback: Function): void;
	/**
	 * Remove middleware function from a group
	 */
	remove(group: string, callback: Function): void;
	/**
	 * Gets middleware functions for a group
	 */
	get(group: string): Function[];
}

/**
 * Middleware Data
 */
export type MiddlewareData = {
	[group: string]: Function[];
};

declare class CoreServiceProvider extends ServiceProvider {
	constructor(core: Core, options?: CoreProviderOptions);
	readonly session: Session;
	readonly tray: Tray;
	readonly pm: Packages;
	readonly clipboard: Clipboard;
	readonly middleware: Middleware;
	/**
	 * Registers contracts
	 */
	registerContracts(): void;
	/**
	 * Expose some internals to global
	 */
	createGlobalApi(): Readonly<{
		make: (name: any, ...args: any[]) => any;
		register: (name: any, callback: any) => void;
		url: (endpoint: any, options: any, metadata: any) => any;
		run: (name: any, args?: {}, options?: {}) => any;
		open: (file: any, options?: {}) => any;
		request: (url: any, options: any, type: any) => any;
	}>;
	/**
	 * Event when dist changes from a build or deployment
	 */
	private _onDistChanged;
	/**
	 * Event when package dist changes from a build or deployment
	 */
	private _onPackageChanged;
	/**
	 * Provides window contract
	 */
	createWindowContract(): CoreProviderWindowContract;
	/**
	 * Provides DnD contract
	 */
	createDnDContract(): CoreProviderDnDContract;
	/**
	 * Provides DOM contract
	 */
	createDOMContract(): CoreProviderDOMContract;
	/**
	 * Provides Theme contract
	 */
	createThemeContract(): CoreProviderThemeContract;
	/**
	 * Provides Sounds contract
	 */
	createSoundsContract(): CoreProviderSoundContract;
	/**
	 * Provides Session contract
	 */
	createSessionContract(): CoreProviderSessionContract;
	/**
	 * Provides Packages contract
	 */
	createPackagesContract(): CoreProviderPackagesContract;
	/**
	 * Provides Clipboard contract
	 */
	createClipboardContract(): CoreProviderClipboardContract;
	/**
	 * Provides Middleware contract
	 */
	createMiddlewareContract(): CoreProviderMiddlewareContract;
	/**
	 * Provides Tray contract
	 */
	createTrayContract(): CoreProviderTrayContract;
}

/**
 * Core Provider Window Contract
 */
export type CoreProviderWindowContract = {
	create: Function;
	list: Function;
	last: Function;
};

/**
 * Core Provider DnD Contract
 */
export type CoreProviderDnDContract = {
	draggable: Function;
	droppable: Function;
};

/**
 * Core Provider Theme Contract
 */
export type CoreProviderDOMContract = {
	script: Function;
	style: Function;
};

/**
 * Core Provider Theme Contract
 */
export type CoreProviderThemeContract = {
	resource: Function;
	icon: Function;
};

/**
 * Core Provider Sound Contract
 */
export type CoreProviderSoundContract = {
	resource: Function;
	play: Function;
};

/**
 * Core Provider Session Contract
 */
export type CoreProviderSessionContract = {
	save: Function;
	load: Function;
};

/**
 * Core Provider Packages Contract
 */
export type CoreProviderPackagesContract = {
	launch?: Function;
	register?: Function;
	addPackages?: Function;
	getPackages?: Function;
	getCompatiblePackages?: Function;
	running?: Function;
};

/**
 * Core Provider Clipboard Contract
 */
export type CoreProviderClipboardContract = {
	clear?: Function;
	set?: Function;
	has?: Function;
	get?: Function;
};

/**
 * Core Provider Middleware Contract
 */
export type CoreProviderMiddlewareContract = {
	add: Function;
	get: Function;
};

/**
 * Core Provider Tray Contract
 */
export type CoreProviderTrayContract = {
	create?: Function;
	remove?: Function;
	list?: TrayEntry[];
	has?: boolean;
};

/**
 * Core Provider Options
 */
export type CoreProviderOptions = {
	/**
	 * Custom Window Behavior
	 */
	windowBehavior?: Function;
};

declare class DesktopServiceProvider extends ServiceProvider {
	/**
	 */
	constructor(core: Core, options?: {});
	/**
	 */
	readonly desktop: Desktop;
	/**
	 */
	createDesktopContract(): DeskopProviderContract;
}

/**
 * Desktop Service Contract
 */
export type DeskopProviderContract = {
	setKeyboardContext: Function;
	openContextMenu: Function;
	addContextMenuEntries: Function;
	applySettings: Function;
	createDropContextMenu: Function;
	getRect: Function;
};

declare class NotificationServiceProvider extends ServiceProvider {
	constructor(core: Core);
	readonly notifications: Notifications;
}

declare class Filesystem extends EventEmitter {
	/**
	 * Create filesystem manager
	 */
	constructor(core: Core, options?: FilesystemOptions);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Adapter registry
	 */
	readonly adapters: {
		name: FilesystemAdapterWrapper;
	};
	/**
	 * Mountpoints
	 */
	mounts: FilesystemMountpoint[];
	/**
	 * Options
	 */
	options: FilesystemOptions;
	/**
	 * A wrapper for VFS method requests
	 */
	readonly proxy: {
		key: Function;
	};
	/**
	 * Mounts all configured mountpoints
	 */
	mountAll(stopOnError?: boolean): Promise<boolean[]>;
	/**
	 * Adds a new mountpoint
	 */
	addMountpoint(
		props: FilesystemMountpoint,
		automount?: boolean
	): Promise<boolean>;
	/**
	 * Mount given filesystem
	 */
	mount(m: string | FilesystemMountpoint): Promise<boolean>;
	/**
	 * Unmount given filesystem
	 */
	unmount(name: string): Promise<boolean>;
	/**
	 * Internal wrapper for mounting/unmounting
	 */
	private _mountpointAction;
	/**
	 * Internal wrapper for mounting/unmounting by name
	 */
	private _mountAction;
	/**
	 * Gets the proxy for VFS methods
	 */
	request(): FilesystemAdapterMethods;
	/**
	 * Perform a VFS method request
	 */
	private _request;
	/**
	 * Request action wrapper
	 */
	private _requestAction;
	/**
	 * Creates a new mountpoint based on given properties
	 */
	createMountpoint(props: FilesystemMountpoint): FilesystemMountpoint;
	/**
	 * Gets mountpoint from given path
	 */
	getMountpointFromPath(file: string | any): FilesystemMountpoint | null;
	/**
	 * Gets all mountpoints
	 */
	getMounts(all?: boolean): FilesystemMountpoint[];
	/**
	 * Gets configured mountpoints
	 */
	private _getConfiguredMountpoints;
}

/**
 * VFS Mountpoint attributes
 */
export type FilesystemMountpointAttributes = {
	/**
	 * Visibility in UI
	 */
	visibility?: string;
	/**
	 * Local filesystem ?
	 */
	local?: boolean;
	/**
	 * If can be searched
	 */
	searchable?: boolean;
	/**
	 * Readonly
	 */
	readOnly?: boolean;
};

/**
 * VFS Mountpoint
 */
export type FilesystemMountpoint = {
	/**
	 * Name
	 */
	name: string;
	/**
	 * Label
	 */
	label: string;
	/**
	 * Adater name
	 */
	adapter: string;
	/**
	 * System adapter root
	 */
	root?: string;
	/**
	 * Enabled state
	 */
	enabled?: boolean;
	/**
	 * Attributes
	 */
	attributes?: FilesystemMountpointAttributes;
};

/**
 * Filesystem Adapter Methods
 */
export type FilesystemAdapterMethods = {
	readdir: Function;
	readfile: Function;
	writefile: Function;
	copy: Function;
	move: Function;
	rename: Function;
	mkdir: Function;
	unlink: Function;
	exists: Function;
	stat: Function;
	url: Function;
	download: Function;
	search: Function;
	touch: Function;
};

export type FilesystemAdapterWrapper = () => FilesystemAdapterMethods;
/**
 * Filesystem Options
 */
export type FilesystemOptions = {
	/**
	 * Adapter registry
	 */
	adapters?: {
		name: FilesystemAdapterWrapper;
	};
	/**
	 * Mountpoints
	 */
	mounts?: FilesystemMountpoint[];
};

declare class VFSServiceProvider extends ServiceProvider {
	/**
	 */
	constructor(core: Core, options?: VFSServiceOptions);
	/**
	 */
	readonly fs: Filesystem;
	/**
	 */
	createVFSContract(): VFSServiceContract;
	/**
	 */
	createFilesystemContract(): VFSServiceFilesystemContract;
}

/**
 * Filesytem Service Contract
 */
export type VFSServiceFilesystemContract = {
	basename: Function;
	pathname: Function;
	pathJoin: Function;
	icon: Function;
	mountpoints: Function;
	mount: Function;
	unmount: Function;
};

/**
 * VFS Service Contract
 */
export type VFSServiceContract = {
	readdir: Function;
	readfile: Function;
	writefile: Function;
	copy: Function;
	move: Function;
	rename: Function;
	mkdir: Function;
	unlink: Function;
	exists: Function;
	stat: Function;
	url: Function;
	download: Function;
	search: Function;
	touch: Function;
};

/**
 * VFS Service Options
 */
export type VFSServiceOptions = {
	adapters?: {
		name: any;
	};
	mountpoints?: any[];
};

declare class AuthServiceProvider extends ServiceProvider {
	/**
	 */
	constructor(core: Core, options?: AuthServiceOptions);
	/**
	 */
	readonly auth: Auth;
	/**
	 */
	createAuthContract(): AuthProviderContract;
}

/**
 * Auth Service Contract
 */
export type AuthProviderContract = {
	show: Function;
	login: Function;
	logout: Function;
	user: Function;
};

/**
 * Auth Service Options
 */
export type AuthServiceOptions = any;

declare class Settings {
	/**
	 * Create application
	 */
	constructor(core: Core, options: SettingsOptions);
	/**
	 * The settings adapter
	 */
	readonly adapter: SettingsAdapter;
	/**
	 * Internal timeout reference used for debouncing
	 */
	debounce: object;
	/**
	 * The settings tree
	 */
	settings: {
		name: any;
	};
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Initializes settings adapter
	 */
	init(): any;
	/**
	 * Saves settings
	 */
	save(): Promise<boolean>;
	/**
	 * Loads settings
	 */
	load(): Promise<boolean>;
	/**
	 * Gets a settings entry by key (cached)
	 */
	get(ns?: string, key?: string, defaultValue?: any): any;
	/**
	 * Sets a settings entry by root key (but does not save).
	 */
	set(ns: string, key?: string, value?: any): Settings;
	/**
	 * Clears a namespace by root key
	 */
	clear(ns: string): Promise<boolean>;
}

export type SettingsAdapterConfiguration = any;
export type SettingsAdapter = any;
export type SettingsAdapterCallback = (core: Core) => SettingsAdapterCallback;

/**
 * Settings Options
 */
export type SettingsOptions = {
	/**
	 * Adapter to use
	 */
	adapter?: SettingsAdapterCallback | SettingsAdapter;
	/**
	 * Adapter configuration
	 */
	config?: SettingsAdapterConfiguration;
};

declare class SettingsServiceProvider extends ServiceProvider {
	constructor(core: Core, options?: SettingsServiceOptions);
	readonly settings: Settings;
	createSettingsContract(): SettingsProviderContract;
}

/**
 * Settings Service Contract
 */
export type SettingsProviderContract = {
	save: Function;
	load: Function;
	clear: Function;
	set: Function;
	get: Function;
};

export type SettingsServiceOptions = {
	config?: any;
};

declare namespace instance {
	export function addMiddleware(m: any): void;
	export function clearMiddleware(): void;
}

/**
 * Basic Application Options
 * @property {String[]} [mimeTypes] What MIME types to support (all/fallback)
 * @property {String[]} [loadMimeTypes] What MIME types to support on load
 * @property {String[]} [saveMimeTypes] What MIME types to support on save
 * @property {String} [defaultFilename] Default filename of a new file
 */
/**
 * Basic Application Helper
 * A class for helping creating basic applications with open/load/create functionality.
 * Also sets the internal proc args for sessions.
 */
export class BasicApplication extends EventEmitter {
	/**
	 * Basic Application Constructor
	 */
	constructor(
		core: Core,
		proc: Application,
		win: Window,
		options?: BasicApplicationOptions
	);
	/**
	 * Core instance reference
	 */
	readonly core: Core;
	/**
	 * Application instance reference
	 */
	readonly proc: Application;
	/**
	 * Window instance reference
	 */
	readonly win: Window;
	/**
	 * Basic Application Options
	 */
	readonly options: BasicApplicationOptions;
	/**
	 * Destroys all Basic Application internals
	 */
	destroy(): void;
	/**
	 * Initializes the application
	 */
	init(): Promise<boolean>;
	/**
	 * Gets options for a dialog
	 */
	getDialogOptions(type: string, options?: {}): object;
	/**
	 * Updates the window title to match open file
	 */
	updateWindowTitle(): void;
	/**
	 * Creates a new dialog of a type
	 */
	createDialog(type: string, cb: Function, options?: object): void;
	/**
	 * Opens given file
	 * Does not do any actual VFS operation
	 */
	open(item: any): void;
	/**
	 * Saves given file
	 * Does not do any actual VFS operation
	 */
	save(item: any): void;
	/**
	 * Create new file
	 * Does not do any actual VFS operation
	 */
	create(): void;
	/**
	 * Create new file
	 */
	createNew(): void;
	/**
	 * Creates a new save dialog
	 */
	createSaveDialog(options?: object): void;
	/**
	 * Creates a new load dialog
	 */
	createOpenDialog(options?: object): void;
	/**
	 * Sets file from open/save action
	 */
	private _setFile;
	/**
	 * Creates the window title
	 */
	private _createTitle;
}

/**
 * Basic Application Options
 */
export type BasicApplicationOptions = {
	/**
	 * What MIME types to support (all/fallback)
	 */
	mimeTypes?: string[];
	/**
	 * What MIME types to support on load
	 */
	loadMimeTypes?: string[];
	/**
	 * What MIME types to support on save
	 */
	saveMimeTypes?: string[];
	/**
	 * Default filename of a new file
	 */
	defaultFilename?: string;
};

export {
	Application,
	Auth,
	AuthServiceProvider,
	Clipboard,
	Middleware,
	Core,
	CoreServiceProvider,
	Desktop,
	DesktopServiceProvider,
	Filesystem,
	Login,
	Notification,
	NotificationServiceProvider,
	Notifications,
	Packages,
	Search,
	Settings,
	SettingsServiceProvider,
	Splash,
	Tray,
	VFSServiceProvider,
	Websocket,
	Window,
	WindowBehavior,
	instance as logger,
};
