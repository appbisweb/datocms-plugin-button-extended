import { getCtxParams, getDefaultValue } from "./helpers";

describe("getDefaultValue", () => {
	it("returns the value if key exists", () => {
		expect(getDefaultValue({ foo: "bar" }, "foo", "fallback")).toBe("bar");
	});

	it("returns the fallback if key is missing", () => {
		expect(getDefaultValue({ foo: "bar" }, "missing", "fallback")).toBe(
			"fallback",
		);
	});

	it("returns the value even if it is falsy (false, 0, empty string)", () => {
		expect(getDefaultValue({ a: false }, "a", true)).toBe(false);
		expect(getDefaultValue({ a: 0 }, "a", 42)).toBe(0);
		expect(getDefaultValue({ a: "" }, "a", "default")).toBe("");
	});

	it("returns fallback when params is undefined", () => {
		expect(getDefaultValue(undefined, "key", "fb")).toBe("fb");
	});
});

describe("getCtxParams", () => {
	it("returns parsed JSON for content_settings when formFieldValues exists", () => {
		const ctx = {
			fieldPath: "data",
			formValues: { data: JSON.stringify({ linkType: "record" }) },
		};
		const result = getCtxParams(ctx, "content_settings");
		expect(result).toEqual({ linkType: "record" });
	});

	it("returns {} for content_settings with invalid JSON", () => {
		const ctx = {
			fieldPath: "data",
			formValues: { data: "not-json" },
		};
		const result = getCtxParams(ctx, "content_settings");
		expect(result).toEqual({});
	});

	it("returns field_settings from ctx.parameters when available", () => {
		const fieldSettings = { allow_record: true, allow_url: false };
		const ctx = {
			parameters: { field_settings: fieldSettings },
			plugin: { attributes: { parameters: {} } },
		};
		const result = getCtxParams(ctx, "field_settings");
		expect(result).toEqual(fieldSettings);
	});

	it("returns field_settings from ctx.field.attributes when parameters.field_settings is empty", () => {
		const fieldSettings = { allow_record: true };
		const ctx = {
			parameters: { field_settings: {} },
			field: {
				attributes: {
					appearance: {
						parameters: { field_settings: fieldSettings },
					},
				},
			},
			plugin: { attributes: { parameters: {} } },
		};
		const result = getCtxParams(ctx, "field_settings");
		expect(result).toEqual(fieldSettings);
	});

	it("returns plugin parameters as fallback", () => {
		const pluginParams = { version: "1.0.0", allow_record: true };
		const ctx = {
			plugin: { attributes: { parameters: pluginParams } },
		};
		const result = getCtxParams(ctx, "plugin_settings");
		expect(result).toEqual(pluginParams);
	});

	it("returns {} when no parameters exist at all", () => {
		const ctx = {
			plugin: { attributes: { parameters: {} } },
		};
		const result = getCtxParams(ctx, "plugin_settings");
		expect(result).toEqual({});
	});

	it("handles nested fieldPath correctly", () => {
		const ctx = {
			fieldPath: "level1.level2",
			formValues: {
				level1: { level2: JSON.stringify({ custom: true }) },
			},
		};
		const result = getCtxParams(ctx, "content_settings");
		expect(result).toEqual({ custom: true });
	});

	it("returns {} for content_settings when formFieldValues is null", () => {
		const ctx = {
			fieldPath: "data",
			formValues: { data: null },
			plugin: { attributes: { parameters: {} } },
		};
		const result = getCtxParams(ctx, "content_settings");
		expect(result).toEqual({});
	});

	it('returns {} for content_settings when stored value is "false"', () => {
		const ctx = {
			fieldPath: "data",
			formValues: { data: "false" },
			plugin: { attributes: { parameters: {} } },
		};
		const result = getCtxParams(ctx, "content_settings");
		expect(result).toEqual({});
	});

	it('returns {} for content_settings when stored value is "null"', () => {
		const ctx = {
			fieldPath: "data",
			formValues: { data: "null" },
			plugin: { attributes: { parameters: {} } },
		};
		const result = getCtxParams(ctx, "content_settings");
		expect(result).toEqual({});
	});
});
