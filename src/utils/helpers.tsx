export function getCtxParams(ctx: any, configType: string) {
	const fieldPath = ctx.fieldPath ? ctx.fieldPath.split(".") : [];
	const formFieldValues = fieldPath.reduce(
		(acc: any, part: any) => acc?.[part],
		ctx?.formValues,
	);

	if (configType === "content_settings" && formFieldValues) {
		try {
			return JSON.parse(formFieldValues);
		} catch {
			return {};
		}
	}

	if (
		configType !== "plugin_settings" &&
		ctx?.parameters?.field_settings &&
		Object.keys(ctx.parameters.field_settings).length > 0
	) {
		return ctx.parameters?.field_settings;
	}

	if (
		configType !== "plugin_settings" &&
		ctx?.field?.attributes?.appearance?.parameters?.field_settings &&
		Object.keys(ctx.field?.attributes.appearance.parameters.field_settings)
			.length > 0
	) {
		return ctx.field.attributes.appearance.parameters.field_settings;
	}

	if (
		ctx?.plugin?.attributes?.parameters &&
		Object.keys(ctx.plugin.attributes.parameters).length > 0
	) {
		return ctx.plugin.attributes.parameters;
	}

	return {};
}

export function getDefaultValue(
	ctxParameters: any,
	key: string,
	fallback: any,
) {
	return ctxParameters?.[key] !== undefined ? ctxParameters[key] : fallback;
}
